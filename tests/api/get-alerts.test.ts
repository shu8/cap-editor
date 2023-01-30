import type { NextApiRequest, NextApiResponse } from "next";
import { expect, test, describe, jest } from "@jest/globals";
import { randomUUID } from "crypto";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate, getStartOfToday } from "../../lib/helpers.client";
import handleAlerts from "../../pages/api/alerts/index";
import { createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts", () => {
  test("no alerts should be returned when no alerts exist", async () => {
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

  test("must be logged in to see JSON alerts", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { json: true },
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("no alerts should be returned when no alerts exist (JSON)", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { json: true },
    });
    mockUserOnce(users.editor);
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData())).toEqual({ error: false, alerts: [] });
  });

  test("only published, non-expired alerts should be returned", async () => {
    const user = await createUser();
    const future = new Date();
    future.setDate(future.getDate() + 1);

    const uuids = [randomUUID(), randomUUID(), randomUUID(), randomUUID()];

    await prismaMock.alert.createMany({
      data: [
        { id: uuids[0], status: "DRAFT", userId: user.id, data: {} },
        { id: uuids[1], status: "TEMPLATE", data: {}, userId: user.id },
        {
          id: uuids[2],
          status: "PUBLISHED",
          userId: user.id,
          data: mapFormAlertDataToCapSchema(
            {
              category: ["Geo"],
              regions: {},
              from: formatDate(getStartOfToday()),
              to: formatDate(new Date()),
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
            uuids[2]
          ),
        },
        {
          id: uuids[3],
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
            uuids[3]
          ),
        },
      ],
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);

    const xml = res._getData();
    expect(xml.match(/<entry>/) || []).toHaveLength(1);
    // Only the last alert has an expiry in future
    uuids.forEach((uuid, i) => {
      if (i === uuids.length - 1) {
        expect(xml.indexOf(uuid)).toBeGreaterThan(-1);
      } else {
        expect(xml.indexOf(uuid)).toEqual(-1);
      }
    });
  });
});
