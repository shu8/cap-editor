import type { NextApiRequest, NextApiResponse } from "next";
import { expect, test, describe, jest } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import handleAlertingAuthorities from "../../pages/api/alertingAuthorities";
import redis from "../../lib/redis";

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

    // Make sure WMO data was cached
    const { res: res2 } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    global.fetch = jest.fn(() => null);
    jest.spyOn(redis, "GET").mockReturnValueOnce(JSON.stringify(mockWMOData));
    await handleAlertingAuthorities(req, res2);
    expect(res2._getStatusCode()).toEqual(200);
    expect(JSON.parse(res2._getData()).result).toEqual(mockWMOData);
  });
});
