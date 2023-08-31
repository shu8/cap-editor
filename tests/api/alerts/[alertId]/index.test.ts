import { describe, expect, jest, test } from "@jest/globals";
import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import { mapFormAlertDataToCapSchema } from "../../../../lib/cap";
import handleAlert from "../../../../pages/api/alerts/[alertId]";
import {
  createUser,
  defaultFormData,
  createAlert,
  mockUserOnce,
  users,
} from "../../helpers";
import { formatDate, getStartOfToday } from "../../../../lib/helpers.client";
import { prismaMock } from "../../setup";
import { DateTime } from "luxon";
import { CAPV12JSONSchema } from "../../../../lib/types/cap.schema";
import { MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME } from "../../../../lib/constants";

const uuid = randomUUID();
const future = new Date();
future.setDate(future.getDate() + 1);
const generateDatabaseAlertData = ({
  id = uuid,
  status = "PUBLISHED",
  alertingAuthorityId = "aa",
  formData = { ...defaultFormData },
} = {}): any => ({
  id,
  status,
  alertingAuthorityId,
  data: mapFormAlertDataToCapSchema(
    { name: "AA", author: "aa@example.com" },
    formData,
    new Date(),
    id,
    randomUUID()
  ),
});

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alerts/:id", () => {
  test("redirects to feed if no alert ID provided", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(302);
  });

  test("returns 404 if alert does not exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: "foo" },
    });
    await handleAlert(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("returns signed alert XML for published, non-expired alerts", async () => {
    const user = await createUser();
    const data = generateDatabaseAlertData();
    data.userId = user.id;
    const alert = await prismaMock.alert.create({ data });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: alert.id },
    });
    await handleAlert(req, res);

    expect(res._getStatusCode()).toEqual(200);
    expect(res.getHeader("content-type")).toEqual("application/xml");

    const xml = res._getData();
    expect(xml).toMatch(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`);
    expect(xml).toMatch(`<ds:Signature`);
    expect(xml).toMatch(uuid);
  });

  test("returns non-signed alert XML for non-published alerts", async () => {
    const user = await createUser();
    const data = generateDatabaseAlertData({
      status: "DRAFT",
    });
    data.userId = user.id;
    const alert = await prismaMock.alert.create({ data });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: alert.id },
    });
    await handleAlert(req, res);

    expect(res._getStatusCode()).toEqual(200);
    expect(res.getHeader("content-type")).toEqual("application/xml");

    const xml = res._getData();
    expect(xml).toMatch(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`);
    expect(xml).not.toMatch(`<ds:Signature`);
    expect(xml).toMatch(uuid);
  });

  test("returns non-signed alert XML for published, expired alerts", async () => {
    const user = await createUser();
    const data = generateDatabaseAlertData({
      formData: {
        ...defaultFormData,
        expires: new Date().toISOString(),
      },
      status: "PUBLISHED",
    });
    data.userId = user.id;
    const alert = await prismaMock.alert.create({ data });

    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertId: alert.id },
    });
    await handleAlert(req, res);

    expect(res._getStatusCode()).toEqual(200);
    expect(res.getHeader("content-type")).toEqual("application/xml");

    const xml = res._getData();
    expect(xml).toMatch(`<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">`);
    expect(xml).not.toMatch(`<ds:Signature`);
    expect(xml).toMatch(uuid);
  });
});

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

    const alertData = dbAlert!.data as CAPV12JSONSchema;
    expect(alertData.info![0].headline).toEqual("Updated headline");

    const sentTimeFormatted = DateTime.fromFormat(
      alertData.sent,
      "yyyy-MM-dd'T'HH:mm:ssZZ",
      { setZone: true }
    ).toFormat("yyyy.MM.dd.HH.mm.ss");
    expect(alertData.identifier).toEqual(`aa.${sentTimeFormatted}`);

    const originalMultiLanguageGroupId = (
      alert.data as CAPV12JSONSchema
    ).info![0]!.parameter?.find(
      (p) => p.valueName === MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME
    )?.value;

    const newMultiLanguageGroupId = alertData.info![0]!.parameter?.find(
      (p) => p.valueName === MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME
    )?.value;

    expect(newMultiLanguageGroupId).toEqual(originalMultiLanguageGroupId);
  });
});
