import { describe, expect, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleAlertingAuthoritiesSettings from "../../pages/api/alertingAuthorities/[alertingAuthorityId]/settings";
import { createUser, mockUserOnce, users } from "./helpers";

const mockWMOData = [
  {
    name: "Test AA",
    id: "aa",
    author: "aa@example.com",
    countryCode: "GB",
    polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
  },
  {
    name: "Test AA 2",
    id: "aa2",
    author: "aa2@example.com",
    countryCode: "GB",
    polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
  },
];

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
    mockUserOnce(users.editor);
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
