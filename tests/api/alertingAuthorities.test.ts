import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleAlertingAuthorities from "../../pages/api/alertingAuthorities";
import { createUser, users } from "./helpers";

const mockWMOData = [
  {
    name: "Test AA",
    id: "aa",
    author: "aa@example.com",
    countryCode: "GB",
    polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
  },
  {
    name: "Test AA 2",
    id: "aa2",
    author: "aa2@example.com",
    countryCode: "GB",
    polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
  },
];

describe("/api/alertingAuthorities", () => {
  test("fetches and caches data from WMO Register of Alerting Authorities", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockWMOData) })
    );
    await handleAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).result).toEqual(mockWMOData);
  });

  test('returns "other" AAs as well as WMO Register of AAs ', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await createUser({
      ...users.composer,
      alertingAuthority: {
        id: "ifrc:custom",
        author: "test@example.com",
        name: "Test Custom AA",
        countryCode: "GB",
      },
      alertingAuthorityVerified: true,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(mockWMOData) })
    );
    await handleAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).result).toEqual([
      ...mockWMOData,
      {
        name: "Test Custom AA",
        id: "ifrc:custom",
        author: "test@example.com",
        countryCode: "GB",
        polygon: null,
      },
    ]);
  });
});
