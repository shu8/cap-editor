import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { formatDate, getStartOfToday } from "../../../../../lib/helpers.client";
import handleAlertingAuthorityAlerts from "../../../../../pages/api/alerts/alertingAuthorities/[alertingAuthorityId]";
import {
  createUser,
  defaultFormData,
  mockUserOnce,
  users,
} from "../../../helpers";
import { prismaMock } from "../../../setup";
import { DateTime } from "luxon";

jest.mock("next-auth/react");
jest.mock("next-auth");

describe("POST /api/alerts/alertingAuthorities/:id", () => {
  test("AA must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "foo", data: defaultFormData },
    });
    await createUser();
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED", data: defaultFormData },
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
      body: { status: "foo", data: defaultFormData },
      query: { alertingAuthorityId: "aa" },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("alert data must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED" },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("AA must exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "foo", data: defaultFormData },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser();
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test(`composers cannot create new PUBLISHED alerts`, async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED", data: defaultFormData },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("alert data must be valid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: "DRAFT",
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

  ["DRAFT", "PUBLISHED"].forEach((alertStatus) => {
    test(`approvers can directly create new alerts of any status (${alertStatus})`, async () => {
      const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
        method: "POST",
        body: { status: alertStatus, data: defaultFormData },
        query: { alertingAuthorityId: "aa" },
      });
      await createUser({ ...users.approver, alertingAuthorityVerified: true });
      mockUserOnce(users.approver);
      await handleAlertingAuthorityAlerts(req, res);
      expect(res._getStatusCode()).toEqual(200);
      expect((await prismaMock.alert.findMany()).length).toEqual(1);
    });
  });

  test(`composers can directly create new alerts of DRAFT status`, async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "DRAFT", data: defaultFormData },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect((await prismaMock.alert.findMany()).length).toEqual(1);
  });

  test(`composers can NOT directly create new alerts of PUBLISHED status`, async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED", data: defaultFormData },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(403);
    expect((await prismaMock.alert.findMany()).length).toEqual(0);
  });

  test(`user must be approved for AA`, async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { status: "PUBLISHED", data: defaultFormData },
      query: { alertingAuthorityId: "aa" },
    });
    await createUser({ ...users.composer, alertingAuthorityVerified: false });
    mockUserOnce(users.composer);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(400);
    expect((await prismaMock.alert.findMany()).length).toEqual(0);
  });

  test("valid alert data should be saved", async () => {
    await createUser({ ...users.admin, alertingAuthorityVerified: true });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: { status: "DRAFT", data: defaultFormData },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).identifier).toBeTruthy();

    const alerts = await prismaMock.alert.findMany();
    expect(alerts).toHaveLength(1);
    const sentTimeFormatted = DateTime.fromFormat(
      alerts[0].data.sent,
      "yyyy-MM-dd'T'HH:mm:ssZZ",
      { setZone: true }
    ).toFormat("yyyy.MM.dd.HH.mm.ss");
    expect(alerts[0].data.identifier).toEqual(`aa.${sentTimeFormatted}`);
    expect(alerts[0].data.info[0].parameter).toHaveLength(2);
    expect(alerts[0].data.info[0].parameter.map((p) => p.valueName)).toEqual([
      "CANONICAL_URL",
      "MULTI_LANGUAGE_GROUP_ID",
    ]);
  });

  test("specified multi-language group ID should be used", async () => {
    await createUser({ ...users.admin, alertingAuthorityVerified: true });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        status: "DRAFT",
        data: defaultFormData,
        multiLanguageGroupId: "test-multi-language-group-id",
      },
    });
    mockUserOnce(users.admin);
    await handleAlertingAuthorityAlerts(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect(JSON.parse(res._getData()).identifier).toBeTruthy();

    const alerts = await prismaMock.alert.findMany();
    expect(
      alerts[0].data.info[0].parameter.find(
        (p) => p.valueName === "MULTI_LANGUAGE_GROUP_ID"
      ).value
    ).toEqual("test-multi-language-group-id");
  });
});
