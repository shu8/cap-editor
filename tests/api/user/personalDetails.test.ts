import { describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handlePersonalDetails from "../../../pages/api/user/personalDetails";
import { createUser, mockUserOnce, users } from "../helpers";
import { prismaMock } from "../setup";

jest.mock("next-auth/react");
jest.mock("next-auth");
describe("/api/user/personalDetails", () => {
  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { name: "Name" },
    });
    await handlePersonalDetails(req, res);
    expect(res._getStatusCode()).toEqual(401);
  });

  test("valid name must be supplied", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    mockUserOnce(users.admin);
    await handlePersonalDetails(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  test("user is updated in db", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { name: "Updated" },
    });
    await createUser();
    mockUserOnce(users.admin);
    await handlePersonalDetails(req, res);
    const user = await prismaMock.user.findFirst({
      where: { email: users.admin.email },
    });
    expect(user?.name).toEqual("Updated");
    expect(res._getStatusCode()).toEqual(200);
  });
});
