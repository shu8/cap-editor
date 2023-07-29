import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleAlertingAuthoritiesSettings from "../../pages/api/alertingAuthorities/[alertingAuthorityId]/settings";
import { createUser, mockUserOnce, users } from "./helpers";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("GET /api/alertingAuthorities/:id/settings", () => {
  test("rejects not-provided AA ID", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  test("requires auth", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa" },
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("fetches AA settings", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "GET",
      query: { alertingAuthorityId: "aa" },
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.admin);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(JSON.parse(res._getData())).toEqual({
      id: "aa",
      countryCode: "GB",
      name: "AA",
      defaultTimezone: "Etc/GMT",
      contact: null,
      web: null,
    });
  });
});

describe("POST /api/alertingAuthorities/:id/settings", () => {
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

  test("requires admin auth", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      query: { alertingAuthorityId: "aa" },
      body: { contact: "contact@aa.com" },
    });

    await createUser({ ...users.admin, alertingAuthorityVerified: true });
    mockUserOnce(users.composer);
    await handleAlertingAuthoritiesSettings(req, res);
    expect(res._getStatusCode()).toEqual(403);
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

    const aa = await prisma?.alertingAuthority.findFirst();
    expect(aa?.contact).toEqual("contact@aa.com");
  });
});
