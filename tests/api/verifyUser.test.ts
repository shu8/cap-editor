import type { NextApiRequest, NextApiResponse } from "next";
import { expect, test, describe } from "@jest/globals";
import { createMocks } from "node-mocks-http";
import handleVerifyUser from "../../pages/api/verifyUser";
import { createUser } from "./helpers";
import { prismaMock } from "./setup";

describe("/api/verifyUser", () => {
  test("body must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    await handleVerifyUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("verification token must exist in db", async () => {
    await createUser();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { verificationToken: "foo" },
    });
    await handleVerifyUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("boolean verification result must be supplied", async () => {
    await createUser();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { verificationToken: "token", verified: "foo" },
    });
    await handleVerifyUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("user is deleted if verification result provided is false", async () => {
    await createUser();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { verificationToken: "token", verified: false },
    });
    await handleVerifyUser(req, res);
    expect((await prismaMock.user.findMany()).length).toEqual(0);
  });

  test("roles must be supplied if verification result supplied is true", async () => {
    await createUser();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { verificationToken: "token", verified: true },
    });
    await handleVerifyUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("user is updated if verification result provided is true", async () => {
    await createUser();
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { verificationToken: "token", verified: true, roles: ["ADMIN"] },
    });
    await handleVerifyUser(req, res);
    const users = await prismaMock.user.findMany();
    expect(users.length).toEqual(1);
    expect(users[0].alertingAuthorityVerificationToken).toEqual(null);
    expect(users[0].alertingAuthorityVerified).toBeTruthy();
    expect(users[0].roles).toEqual(["ADMIN"]);
  });
});
