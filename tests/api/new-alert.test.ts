import type { NextApiRequest, NextApiResponse } from "next";
import { expect, test, describe, jest } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import { formatDate, getStartOfToday } from "../../lib/helpers";
import handleAlerts from "../../pages/api/alerts/index";
import { createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("POST /api/alerts", () => {
  test("alert status must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("valid alert status must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "foo" },
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED" },
    });
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  ["DRAFT", "TEMPLATE", "PUBLISHED"].forEach((alertStatus) => {
    test(`validators cannot directly create new alerts of any status (${alertStatus}`, async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { status: alertStatus },
      });
      mockUserOnce(users.validator);
      await handleAlerts(req, res);
      expect(res._getStatusCode()).toEqual(403);
    });
  });

  ["EDITOR", "VALIDATOR"].forEach((userType) => {
    test(`${userType}s cannot publish new alerts directly`, async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { status: "PUBLISHED" },
      });
      mockUserOnce(users[userType.toLowerCase()]);
      await handleAlerts(req, res);
      expect(res._getStatusCode()).toEqual(403);
    });
  });

  test("alert data must be valid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
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
      },
    });
    mockUserOnce(users.admin);
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
    expect((await prismaMock.alert.findMany()).length).toEqual(0);
  });

  test("valid alert data should be saved", async () => {
    await createUser({ roles: ["ADMIN"], email: "admin@example.com" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
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
      },
    });
    mockUserOnce(users.admin);
    await handleAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).identifier).toBeTruthy();
    expect((await prismaMock.alert.findMany()).length).toEqual(1);
  });
});
