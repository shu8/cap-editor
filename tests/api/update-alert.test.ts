import { describe, expect, jest, test } from "@jest/globals";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { formatDate, getStartOfToday } from "../../lib/helpers.client";
import handleAlert from "../../pages/api/alerts/[alertId]";
import {
  createAlert,
  createUser,
  defaultFormData,
  mockUserOnce,
  users,
} from "./helpers";
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
      body: { status: "foo", data: defaultFormData },
    });

    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("requires alert data to be provided", async () => {
    const alert = await createAlert({ status: "DRAFT" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { id: alert.id },
      body: { status: "PUBLISHED" },
    });

    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("requires user to be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: "foo" },
      body: { status: "PUBLISHED", data: defaultFormData },
    });

    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("user must be part of alert AA and verified", async () => {
    const alert = await createAlert({ status: "DRAFT" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: { status: "PUBLISHED", data: defaultFormData },
    });

    await createUser({ ...users.composer, alertingAuthorityVerified: false });
    mockUserOnce(users.composer);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test(`guest users cannot edit PUBLISHED alerts`, async () => {
    const alert = await createAlert({ status: "PUBLISHED" });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: { status: "PUBLISHED", data: defaultFormData },
    });

    const editor = await createUser({
      roles: [],
      email: "guest@example.com",
      name: "Guest",
      alertingAuthorityVerified: false,
    });
    await prismaMock.sharedAlert.create({
      data: { alertId: alert.id, userId: editor.id },
    });
    mockUserOnce({
      email: "guest@example.com",
      name: "Guest",
      image: "",
      alertingAuthority: {},
    });
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(410);
  });

  test("composers cannot PUBLISH alerts", async () => {
    const alert = await createAlert();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: { status: "PUBLISHED", data: defaultFormData },
    });

    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("returns 404 if alert not found", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: "foo" },
      body: { status: "PUBLISHED", data: defaultFormData },
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("cannot edit already-published alerts", async () => {
    const alert = await createAlert({
      userDetails: { ...users.admin, alertingAuthorityVerified: true },
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: { status: "DRAFT", data: defaultFormData },
    });

    mockUserOnce(users.admin);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("requires valid alert data", async () => {
    const alert = await createAlert({
      status: "DRAFT",
      userDetails: { ...users.admin, alertingAuthorityVerified: true },
    });
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
        },
      },
    });

    mockUserOnce(users.admin);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("updates alert when valid data provided", async () => {
    const alert = await createAlert({
      status: "DRAFT",
      userDetails: { ...users.admin, alertingAuthorityVerified: true },
    });
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "PUT",
      query: { alertId: alert.id },
      body: {
        status: "PUBLISHED",
        data: { ...defaultFormData, headline: "Updated headline" },
      },
    });

    mockUserOnce(users.admin);
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(200);
    const dbAlert = await prismaMock.alert.findFirst();
    expect(dbAlert).toBeTruthy();
    expect(dbAlert!.status).toEqual("PUBLISHED");
    expect(dbAlert!.data.info[0].headline).toEqual("Updated headline");
  });
});
