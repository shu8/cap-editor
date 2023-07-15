import { describe, expect, jest, test } from "@jest/globals";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate, getStartOfToday } from "../../lib/helpers.client";
import handleAlertingAuthorityAlerts from "../../pages/api/alerts/alertingAuthorities/[alertingAuthorityId]";
import { createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts/alertingAuthorities/:id", () => {
  test("404 when AA does not exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "foo" },
    });
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("must be logged in to see JSON alerts", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa", json: true },
    });
    await createUser();
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("no alerts should be returned when no alerts exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa" },
    });
    await createUser();
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const xml = res._getData();
    expect(xml.indexOf("<entry>")).toEqual(-1);
    expect(
      xml.indexOf(`<feed xmlns="http://www.w3.org/2005/Atom">`)
    ).toBeGreaterThan(-1);
  });

  test("no alerts should be returned when no alerts exist (JSON)", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { json: true, alertingAuthorityId: "aa" },
    });
    await createUser();
    mockUserOnce(users.editor);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData())).toEqual({ error: false, alerts: [] });
  });

  test("user must be part of AA to get JSON alerts", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { json: true, alertingAuthorityId: "aa2" },
    });
    mockUserOnce(users.editor);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("only published, non-expired alerts, for the requested AA should be returned", async () => {
    const user = await createUser();
    const user2 = await createUser({
      roles: ["ADMIN"],
      email: "admin2@example.com",
      name: "Foo 2",
      alertingAuthority: {
        author: "aa@example.com",
        countryCode: "GB",
        id: "aa2",
        name: "AA",
      },
    });
    const future = new Date();
    future.setDate(future.getDate() + 1);

    const uuids = [
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ];

    await prismaMock.alert.createMany({
      data: [
        {
          id: uuids[0],
          status: "DRAFT",
          userId: user.id,
          alertingAuthorityId: "aa",
          data: {},
        },
        {
          id: uuids[1],
          status: "TEMPLATE",
          data: {},
          alertingAuthorityId: "aa",
          userId: user.id,
        },
        {
          id: uuids[2],
          status: "PUBLISHED",
          userId: user.id,
          alertingAuthorityId: "aa",
          data: mapFormAlertDataToCapSchema(
            { name: "AA", author: "aa@example.com" },
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
          userId: user2.id,
          alertingAuthorityId: "aa2",
          data: mapFormAlertDataToCapSchema(
            { name: "AA2", author: "aa2@example.com" },
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
            uuids[3]
          ),
        },
        {
          id: uuids[4],
          status: "PUBLISHED",
          userId: user.id,
          alertingAuthorityId: "aa",
          data: mapFormAlertDataToCapSchema(
            { name: "AA", author: "aa@example.com" },
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
            uuids[4]
          ),
        },
      ],
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa" },
    });
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);

    const xml = res._getData();
    expect(xml.match(/<entry>/) || []).toHaveLength(1);

    // Only the last alert has an expiry in future and is for this AA
    uuids.forEach((uuid, i) => {
      if (i === uuids.length - 1) {
        expect(xml.indexOf(uuid)).toBeGreaterThan(-1);
      } else {
        expect(xml.indexOf(uuid)).toEqual(-1);
      }
    });
  });
});
