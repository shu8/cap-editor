import { describe, expect, jest, test } from "@jest/globals";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate } from "../../lib/helpers.client";
import handleAlert from "../../pages/api/alerts/[alertId]";
import { createUser } from "./helpers";
import { prismaMock } from "./setup";

const uuid = randomUUID();
const future = new Date();
future.setDate(future.getDate() + 1);
const databaseAlertData: any = {
  id: uuid,
  status: "PUBLISHED",
  alertingAuthorityId: "aa",
  data: mapFormAlertDataToCapSchema(
    { name: "AA", author: "aa@example.com", web: 'https://example.com', contact: 'example@example.com' },
    {
      category: ["Geo"],
      regions: {},
      from: formatDate(new Date()),
      to: formatDate(future),
      actions: ["Shelter"],
      certainty: "Observed",
      severity: "Extreme",
      urgency: "Immediate",
      status: "Actual",
      msgType: "Alert",
      references: [],
      textLanguages: {
        en: {
          event: "Test",
          headline: "Test",
          description: "Test",
          instruction: "Test",
          resources: [],
        },
      },
    },
    uuid
  ),
};

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts/:id", () => {
  test("redirects to feed if no alert ID provided", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(302);
  });

  test("returns 404 if alert does not exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: "foo" },
    });
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("returns signed alert XML for published, non-expired alerts", async () => {
    const user = await createUser();
    const data = { ...databaseAlertData };
    data.userId = user.id;
    const alert = await prismaMock.alert.create({ data });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: alert.id },
    });
    await handleAlert(req, res);

    expect(res._getStatusCode()).toEqual(200);
    expect(res.getHeader("content-type")).toEqual("application/xml");

    const xml = res._getData();
    expect(
      xml.indexOf(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`)
    ).toBeGreaterThan(-1);
    expect(xml.indexOf(`<ds:Signature`)).toBeGreaterThan(-1);
    expect(xml.indexOf(uuid)).toBeGreaterThan(-1);
  });

  ["DRAFT", "TEMPLATE"].forEach((status) => {
    test("returns non-signed alert XML for non-published alerts", async () => {
      const user = await createUser();
      const data = { ...databaseAlertData };
      data.userId = user.id;
      data.status = status;
      const alert = await prismaMock.alert.create({ data });

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "GET",
        query: { alertId: alert.id },
      });
      await handleAlert(req, res);

      expect(res._getStatusCode()).toEqual(200);
      expect(res.getHeader("content-type")).toEqual("application/xml");

      const xml = res._getData();
      expect(
        xml.indexOf(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`)
      ).toBeGreaterThan(-1);
      expect(xml.indexOf(`<ds:Signature`)).toEqual(-1);
      expect(xml.indexOf(uuid)).toBeGreaterThan(-1);
    });
  });

  test("returns non-signed alert XML for published, expired alerts", async () => {
    const user = await createUser();
    const data = { ...databaseAlertData };
    data.userId = user.id;
    data.status = "PUBLISHED";
    data.data.info[0].expires = formatDate(new Date());
    const alert = await prismaMock.alert.create({ data });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: alert.id },
    });
    await handleAlert(req, res);

    expect(res._getStatusCode()).toEqual(200);
    expect(res.getHeader("content-type")).toEqual("application/xml");

    const xml = res._getData();
    expect(
      xml.indexOf(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`)
    ).toBeGreaterThan(-1);
    expect(xml.indexOf(`<ds:Signature`)).toEqual(-1);
    expect(xml.indexOf(uuid)).toBeGreaterThan(-1);
  });
});
