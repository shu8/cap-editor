import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleAlerts from "../../pages/api/alerts/index";
import { createUser } from "./helpers";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts", () => {
  test("no feed URLs should be returned when no AAs exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const xml = res._getData();
    expect(xml.indexOf("<entry>")).toEqual(-1);
    expect(
      xml.indexOf(`<feed xmlns="http://www.w3.org/2005/Atom">`)
    ).toBeGreaterThan(-1);
  });

  test("feed URLs should be returned for each AA", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await createUser();
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const xml = res._getData();
    expect(xml.indexOf("<entry>")).toBeGreaterThan(-1);
    expect(
      xml.indexOf(`<feed xmlns="http://www.w3.org/2005/Atom">`)
    ).toBeGreaterThan(-1);
    expect(xml.indexOf(`/feed/alertingAuthorities/aa`)).toBeGreaterThan(-1);
  });
});
