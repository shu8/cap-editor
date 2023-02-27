import { describe, expect, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleRegister from "../../pages/api/register";
import { prismaMock } from "./setup";

describe("/api/register", () => {
  test("body must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("valid name must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "aa", email: "test@example.com" },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("valid email must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { alertingAuthorityId: "aa", name: "test" },
    });
    await handleRegister(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("user is created in db", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { name: "test", email: "test@example.com" },
    });
    await handleRegister(req, res);
    const users = await prismaMock.user.findMany();
    expect(users.length).toEqual(1);
    expect(users[0].name).toEqual("test");
    expect(users[0].email).toEqual("test@example.com");
    expect(res._getStatusCode()).toEqual(200);
  });
});
