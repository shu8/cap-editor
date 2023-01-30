import { expect, test, describe, jest } from "@jest/globals";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate } from "../../lib/helpers.client";
import handleAlert from "../../pages/api/alerts/[alertId]";
import { createUser } from "./helpers";
import { prismaMock } from "./setup";

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

  test("returns alert XML", async () => {
    const uuid = randomUUID();
    const user = await createUser();
    const future = new Date();
    future.setDate(future.getDate() + 1);

    const alert = await prismaMock.alert.create({
      data: {
        id: uuid,
        status: "PUBLISHED",
        userId: user.id,
        data: mapFormAlertDataToCapSchema(
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
            scope: "Public",
            restriction: "",
            addresses: [],
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
      },
    });

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
    expect(xml.indexOf(uuid)).toBeGreaterThan(-1);
  });
});
