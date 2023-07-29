import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleAlertingAuthoritiesSettings from "../../pages/api/alertingAuthorities/[alertingAuthorityId]/settings";
import { createUser, mockUserOnce, users } from "./helpers";
import { prismaMock } from "./setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alertingAuthorities/:id/settings", () => {
  test("requires auth", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa" },
    });

    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("rejects not-provided AA ID", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("fetches AA settings", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa" },
    });

    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(JSON.parse(res._getData())).toEqual({
      id: "aa",
      countryCode: "GB",
      name: "AA",
      defaultTimezone: "Etc/GMT",
      contact: "example@example.com",
      web: "https://example.com",
    });
  });
});

describe("POST /api/alertingAuthorities/:id/settings", () => {
  test("requires admin auth", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: { contact: "contact@aa.com" },
    });

    await createUser({ ...users.composer, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("rejects invalid AA", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "foo" },
      body: { contact: "contact@aa.com" },
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("saves AA settings", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: { contact: "contact@aa.com" },
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handleAlertingAuthoritiesSettings(req, res);

    const aa = await prismaMock.alertingAuthority.findFirst();
    expect(aa?.contact).toEqual("contact@aa.com");
  });
});
