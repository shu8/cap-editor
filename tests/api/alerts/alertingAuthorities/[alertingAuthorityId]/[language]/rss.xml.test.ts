import { describe, expect, jest, test } from "@jest/globals";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../../../../../lib/cap";
import {
  formatDate,
  getStartOfToday,
} from "../../../../../../lib/helpers.client";
import handleAlertingAuthorityAlerts from "../../../../../../pages/api/alerts/alertingAuthorities/[alertingAuthorityId]/[language]/rss.xml";
import { createUser, mockUserOnce, users } from "../../../../helpers";
import { prismaMock } from "../../../../setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts/alertingAuthorities/:id/:language/rss.xml", () => {
  test("must provide language", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "foo" },
    });
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("404 when AA does not exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "foo", language: "eng" },
    });
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("no alerts should be returned when no alerts exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa", language: "eng" },
    });
    await createUser();
    await handleAlertingAuthorityAlerts(req, res);

    expect(res._getStatusCode()).toEqual(200);
    const xml = res._getData();
    expect(xml).toMatch(`<rss version="2.0">`);
    expect(xml).not.toMatch("<entry>");
  });

  test("only published, non-expired alerts, for the requested AA and language should be returned", async () => {
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
              language: "eng",
              responseType: ["Shelter"],
              certainty: "Observed",
              severity: "Extreme",
              urgency: "Immediate",
              status: "Actual",
              msgType: "Alert",
              references: [],
              event: "Test",
              headline: "Test",
              description: "Test",
              instruction: "Test",
              resources: [],
            },
            new Date(),
            uuids[1],
            randomUUID()
          ),
        },
        {
          id: uuids[2],
          status: "PUBLISHED",
          userId: user2.id,
          alertingAuthorityId: "aa2",
          data: mapFormAlertDataToCapSchema(
            { name: "AA2", author: "aa2@example.com" },
            {
              category: ["Geo"],
              regions: {},
              onset: formatDate(new Date()),
              expires: formatDate(future),
              language: "eng",
              responseType: ["Shelter"],
              certainty: "Observed",
              severity: "Extreme",
              urgency: "Immediate",
              status: "Actual",
              msgType: "Alert",
              references: [],
              event: "Test",
              headline: "Test",
              description: "Test",
              instruction: "Test",
              resources: [],
            },
            new Date(),
            uuids[2],
            randomUUID()
          ),
        },
        {
          id: uuids[3],
          status: "PUBLISHED",
          userId: user.id,
          alertingAuthorityId: "aa",
          language: "fra",
          data: mapFormAlertDataToCapSchema(
            { name: "AA", author: "aa@example.com" },
            {
              category: ["Geo"],
              regions: {},
              onset: formatDate(new Date()),
              expires: formatDate(future),
              language: "fra",
              responseType: ["Shelter"],
              certainty: "Observed",
              severity: "Extreme",
              urgency: "Immediate",
              status: "Actual",
              msgType: "Alert",
              references: [],
              event: "Essai",
              headline: "Essai",
              description: "Essai",
              instruction: "Essai",
              resources: [],
            },
            new Date(),
            uuids[3],
            randomUUID()
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
              onset: formatDate(new Date()),
              expires: formatDate(future),
              language: "eng",
              responseType: ["Shelter"],
              certainty: "Observed",
              severity: "Extreme",
              urgency: "Immediate",
              status: "Actual",
              msgType: "Alert",
              references: [],
              event: "Test",
              headline: "Test",
              description: "Test",
              instruction: "Test",
              resources: [],
            },
            new Date(),
            uuids[4],
            randomUUID()
          ),
        },
      ],
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa", language: "eng" },
    });
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);

    const xml = res._getData();
    expect(xml.match(/<item>/) || []).toHaveLength(1);

    // Only the last alert has an expiry in future and is for this AA and language
    uuids.forEach((uuid, i) => {
      if (i === uuids.length - 1) {
        expect(xml).toMatch(uuid);
      } else {
        expect(xml).not.toMatch(uuid);
      }
    });
  });
});
