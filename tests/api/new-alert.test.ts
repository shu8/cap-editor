import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { formatDate, getStartOfToday } from "../../lib/helpers.client";
import handleAlertingAuthorityAlerts from "../../pages/api/alerts/alertingAuthorities/[alertingAuthorityId]";
import { createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("POST /api/alerts/alertingAuthorities/:id", () => {
  test("AA must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "foo" },
    });
    await createUser();
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED" },
      query: { alertingAuthorityId: "aa" },
    });
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("alert status must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("valid alert status must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "foo" },
      query: { alertingAuthorityId: "aa" },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("AA must exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "foo" },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser();
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  ["DRAFT", "TEMPLATE", "PUBLISHED"].forEach((alertStatus) => {
    test(`validators cannot directly create new alerts of any status (${alertStatus})`, async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { status: alertStatus },
        query: { alertingAuthorityId: "aa" },
      });
      await createUser({ ...users.validator, alertingAuthorityVerified: true });
      mockUserOnce(users.validator);
      await handleAlertingAuthorityAlerts(req, res);
      expect(res._getStatusCode()).toEqual(403);
    });
  });

  ["EDITOR", "VALIDATOR"].forEach((userType) => {
    test(`${userType}s cannot publish new alerts directly`, async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { status: "PUBLISHED" },
        query: { alertingAuthorityId: "aa" },
      });

      await createUser({
        ...users[userType.toLowerCase()],
        alertingAuthorityVerified: true,
      });
      mockUserOnce(users[userType.toLowerCase()]);
      await handleAlertingAuthorityAlerts(req, res);
      expect(res._getStatusCode()).toEqual(403);
    });
  });

  test("alert data must be valid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: "TEMPLATE",
        data: {
          category: ["Geo"],
          regions: {},
          from: formatDate(new Date()),
          to: formatDate(getStartOfToday()),
          actions: ["foo"],
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
      },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
    expect((await prismaMock.alert.findMany()).length).toEqual(0);
  });

  test("valid alert data should be saved", async () => {
    await createUser({ ...users.admin, alertingAuthorityVerified: true });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: "TEMPLATE",
        data: {
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
      },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).identifier).toBeTruthy();
    expect((await prismaMock.alert.findMany()).length).toEqual(1);
  });
});
