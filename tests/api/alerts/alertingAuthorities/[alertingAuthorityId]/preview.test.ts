import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { formatDate, getStartOfToday } from "../../../../../lib/helpers.client";
import handlePreviewNewAlertingAuthorityAlert from "../../../../../pages/api/alerts/alertingAuthorities/[alertingAuthorityId]/preview";
import {
  createUser,
  defaultFormData,
  mockUserOnce,
  users,
} from "../../../helpers";

jest.mock("next-auth/react");
jest.mock("next-auth");

describe("POST /api/alerts/alertingAuthorities/:id/preview", () => {
  test("AA must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: defaultFormData,
    });
    await createUser();
    await handlePreviewNewAlertingAuthorityAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: defaultFormData,
      query: { alertingAuthorityId: "aa" },
    });
    await handlePreviewNewAlertingAuthorityAlert(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("alert data must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
    });
    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handlePreviewNewAlertingAuthorityAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("AA must exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: defaultFormData,
      query: { alertingAuthorityId: "aa2" },
    });
    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handlePreviewNewAlertingAuthorityAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("alert data must be valid", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: {
        regions: {},
        onset: formatDate(new Date()),
        expires: formatDate(getStartOfToday()),
        language: "eng",
        actions: ["foo"],
        certainty: "Observed",
        severity: "Extreme",
        urgency: "Immediate",
        status: "Actual",
        msgType: "Alert",
        references: [],
        headline: "Test",
        event: "Test",
        description: "Test",
        instruction: "Test",
        resources: [],
      },
    });
    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handlePreviewNewAlertingAuthorityAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);

    const data = JSON.parse(res._getData());
    expect(data.error).toEqual(true);
    expect(data.messages).toHaveLength(1);
    expect(data.messages[0]).toEqual(`info[0] requires property "category"`);
  });
});
