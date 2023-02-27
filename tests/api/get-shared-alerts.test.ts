import { describe, expect, jest, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleSharedAlerts from "../../pages/api/alerts/shared";
import { createAlert, createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts/shared", () => {
  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await handleSharedAlerts(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("returns no shared alerts if none exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await createUser(users.admin);
    mockUserOnce(users.admin);
    await handleSharedAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData())).toEqual({
      error: false,
      alerts: [],
    });
  });

  test("returns shared alerts", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    const alert = await createAlert({ userDetails: users.admin });
    await prismaMock.sharedAlert.create({
      data: { userId: alert.userId, alertId: alert.id },
    });
    mockUserOnce(users.admin);
    await handleSharedAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const json = JSON.parse(res._getData());
    expect(json.error).toEqual(false);
    expect(json.alerts.length).toEqual(1);
    expect(json.alerts[0].id).toEqual(alert.id);
  });
});
