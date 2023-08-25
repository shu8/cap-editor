import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleAlerts from "../../../pages/api/alerts/index";
import { createAlert, createUser } from "../helpers";
import { randomUUID } from "crypto";
import { prismaMock } from "../setup";
import { mapFormAlertDataToCapSchema } from "../../../lib/cap";
import { formatDate } from "../../../lib/helpers.client";

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
    expect(xml).not.toMatch("<item>");
    expect(xml).toMatch(`<rss version="2.0">`);
  });

  test("feed URLs should not be returned for AAs with no alerts (new AAs)", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const xml = res._getData();
    expect(xml).toMatch(`<rss version="2.0">`);
    expect(xml).not.toMatch("<item>");
    expect(xml).not.toMatch(`/feed/alertingAuthorities/`);
  });

  test("feed URLs should be returned for each AA that has alerts", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await createAlert();
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const xml = res._getData();
    expect(xml).toMatch("<item>");
    expect(xml).toMatch(`<rss version="2.0">`);
    expect(xml).toMatch(`/feed/alertingAuthorities/aa/eng/rss.xml`);
  });
});
