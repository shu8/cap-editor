import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleUserAlertingAuthorities from "../../../pages/api/user/alertingAuthorities";
import { createUser, mockUserOnce, users } from "../helpers";
import { prismaMock } from "../setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("/api/user/alertingAuthorities", () => {
  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "foo" },
    });
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("must provide AA ID", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    mockUserOnce(users.admin);
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("AA must exist", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "foo" },
    });
    await createUser();
    mockUserOnce(users.admin);
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("user must have set their name before joining AA", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "aa" },
    });
    mockUserOnce(users.admin);
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("user AA is updated in DB", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "aa2" },
    });
    const user = await createUser();
    mockUserOnce(users.admin);
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(200);

    const alertingAuthority =
      await prismaMock.userAlertingAuthorities.findFirst();
    expect(alertingAuthority?.verificationToken).toBeTruthy();
    expect(alertingAuthority?.userId).toEqual(user.id);
    expect(alertingAuthority?.alertingAuthorityId).toEqual("aa");
  });

  test("requires other AA name", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "other" },
    });
    await createUser();
    mockUserOnce(users.admin);
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("other AA is created in DB", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "other", name: "Other Alerting Authority" },
    });
    const user = await createUser();
    mockUserOnce(users.admin);
    await handleUserAlertingAuthorities(req, res);
    expect(res._getStatusCode()).toEqual(200);

    const alertingAuthority =
      await prismaMock.userAlertingAuthorities.findFirst({
        where: {
          AlertingAuthority: { name: { equals: "Other Alerting Authority" } },
        },
      });
    expect(alertingAuthority?.verificationToken).toBeTruthy();
    expect(alertingAuthority?.userId).toEqual(user.id);
    expect(alertingAuthority?.alertingAuthorityId?.startsWith("ifrc:")).toEqual(
      true
    );
  });
});
