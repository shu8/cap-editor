import { describe, expect, jest, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleShareAlert from "../../pages/api/alerts/[alertId]/share";
import { createAlert, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("POST /api/alerts/:id/share", () => {
  test("requires alert ID to be provided", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("requires email address to be provided", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { id: "foo" },
    });

    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("requires user to be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertId: "foo" },
      body: { email: "guest@example.com" },
    });

    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("requires alert to exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertId: "foo" },
      body: { email: "guest@example.com" },
    });

    mockUserOnce(users.admin);
    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("requires user AA to be verified", async () => {
    const alert = await createAlert();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertId: alert.id },
      body: { email: "guest@example.com" },
    });

    mockUserOnce(users.admin);
    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("validators cannot share alerts", async () => {
    const alert = await createAlert({
      userDetails: { ...users.validator, alertingAuthorityVerified: true },
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertId: alert.id },
      body: { email: "guest@example.com" },
    });

    mockUserOnce(users.validator);
    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  ["PUBLISHED", "TEMPLATE"].forEach((status) => {
    test(`${status} alerts cannot be shared`, async () => {
      const alert = await createAlert({
        status,
        userDetails: { ...users.admin, alertingAuthorityVerified: true },
      });

      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        query: { alertId: alert.id },
        body: { email: "guest@example.com" },
      });

      mockUserOnce(users.admin);
      await handleShareAlert(req, res);
      expect(res._getStatusCode()).toEqual(403);
    });
  });

  test("Draft alert can be shared successfully", async () => {
    const alert = await createAlert({
      status: "DRAFT",
      userDetails: { ...users.admin, alertingAuthorityVerified: true },
    });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertId: alert.id },
      body: { email: "guest@example.com" },
    });

    mockUserOnce(users.admin);
    await handleShareAlert(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(await prismaMock.sharedAlert.count()).toEqual(1);
  });
});
