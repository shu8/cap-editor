import { describe, expect, jest, test } from "@jest/globals";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import handleAlert from "../../pages/api/alerts/[alertId]";
import { createUser, defaultFormData } from "./helpers";
import { prismaMock } from "./setup";

const uuid = randomUUID();
const future = new Date();
future.setDate(future.getDate() + 1);
const generateDatabaseAlertData = ({
  id = uuid,
  status = "PUBLISHED",
  alertingAuthorityId = "aa",
  formData = { ...defaultFormData },
} = {}): any => ({
  id,
  status,
  alertingAuthorityId,
  data: mapFormAlertDataToCapSchema(
    { name: "AA", author: "aa@example.com" },
    formData,
    id
  ),
});

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
    const data = generateDatabaseAlertData();
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
    expect(xml).toMatch(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`);
    expect(xml).toMatch(`<ds:Signature`);
    expect(xml).toMatch(uuid);
  });

  test("returns non-signed alert XML for non-published alerts", async () => {
    const user = await createUser();
    const data = generateDatabaseAlertData({
      status: "DRAFT",
    });
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
    expect(xml).toMatch(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`);
    expect(xml).not.toMatch(`<ds:Signature`);
    expect(xml).toMatch(uuid);
  });

  test("returns non-signed alert XML for published, expired alerts", async () => {
    const user = await createUser();
    const data = generateDatabaseAlertData({
      formData: {
        ...defaultFormData,
        expires: new Date().toISOString(),
      },
      status: "PUBLISHED",
    });
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
    expect(xml).toMatch(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`);
    expect(xml).not.toMatch(`<ds:Signature`);
    expect(xml).toMatch(uuid);
  });
});
