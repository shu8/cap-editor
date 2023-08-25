import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleExportAlertingAuthorityAlerts from "../../../../../pages/api/alerts/alertingAuthorities/[alertingAuthorityId]/export";
import { createAlert, mockUserOnce, users } from "../../../helpers";
import { DateTime } from "luxon";

jest.mock("next-auth/react");
jest.mock("next-auth");

describe("POST /api/alerts/alertingAuthorities/:id/export", () => {
  test("AA must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: {
        status: ["PUBLISHED"],
        sent: [new Date(), new Date()],
        language: ["eng"],
      },
    });
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: ["PUBLISHED"],
        sent: [new Date(), new Date()],
        language: ["eng"],
      },
    });
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("all three filter params must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: { status: ["PUBLISHED"], sent: [new Date(), new Date()] },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("sent filter must be array of length 2", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: { status: ["PUBLISHED"], sent: new Date(), language: ["eng"] },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("status filter must be array", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: "PUBLISHED",
        sent: [new Date(), new Date()],
        language: ["eng"],
      },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("language filter must be array", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: ["PUBLISHED"],
        sent: [new Date(), new Date()],
        language: "eng",
      },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("user must be part of AA", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa2" },
      body: {
        status: ["PUBLISHED"],
        sent: [new Date(), new Date()],
        language: ["eng"],
      },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("no data is exported when no alerts exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: ["PUBLISHED"],
        sent: [new Date(), new Date()],
        language: ["eng"],
      },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    const data = JSON.parse(res._getData());
    expect(data).toBeTruthy();
    expect(data).toEqual([]);
  });

  test("data is exported when alerts exist", async () => {
    const alert = await createAlert();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: ["PUBLISHED"],
        sent: [
          DateTime.now().minus({ days: 1 }).toJSDate(),
          DateTime.now().plus({ days: 1 }).toJSDate(),
        ],
        language: ["eng"],
      },
    });
    mockUserOnce(users.admin);
    await handleExportAlertingAuthorityAlerts(req, res);
    const data = JSON.parse(res._getData());
    expect(data).toBeTruthy();
    expect(data).toEqual([
      {
        alertingAuthorityId: alert.alertingAuthorityId,
        id: alert.id,
        language: alert.language,
        status: alert.status,
        data: alert.data,
      },
    ]);
  });
});
