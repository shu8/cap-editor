import { expect, test, describe, jest } from "@jest/globals";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate, getStartOfToday } from "../../lib/helpers";
import handleAlert from "../../pages/api/alerts/[alertId]";
import { createAlert, createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("PUT /api/alerts/:id", () => {
  test("requires alert ID to be provided", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
    });
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("requires valid alert status to be provided", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { id: "foo" },
      body: { status: "foo" },
    });

    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("requires user to be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: "foo" },
      body: { status: "PUBLISHED" },
    });

    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("editors cannot publish existing alerts", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: "foo" },
      body: { status: "PUBLISHED" },
    });

    mockUserOnce(users.editor);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("returns 404 if alert not found", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: "foo" },
      body: { status: "PUBLISHED" },
    });

    mockUserOnce(users.admin);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("cannot edit already-published alerts", async () => {
    const alert = await createAlert();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: { status: "DRAFT" },
    });

    mockUserOnce(users.admin);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("validators cannot edit a template", async () => {
    const alert = await createAlert({ status: "TEMPLATE" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: { status: "PUBLISHED" },
    });

    mockUserOnce(users.validator);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("requires valid alert data", async () => {
    const alert = await createAlert({ status: "TEMPLATE" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: {
        status: "PUBLISHED",
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
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("updates alert when valid data provided", async () => {
    const alert = await createAlert({ status: "TEMPLATE" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: {
        status: "PUBLISHED",
        data: {
          category: ["Geo"],
          regions: {},
          from: formatDate(new Date()),
          to: formatDate(getStartOfToday()),
          actions: ["Prepare"],
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
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(200);
    expect((await prismaMock.alert.findFirst())?.status).toEqual("PUBLISHED");
  });
});
