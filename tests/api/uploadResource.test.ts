import { beforeAll, describe, expect, jest, test } from "@jest/globals";
import type { NextApiRequest, NextApiResponse } from "next";
import { createMocks } from "node-mocks-http";
import handleUploadResource from "../../pages/api/uploadResource";
import { mockUserOnce, users } from "./helpers";

jest.mock("../../lib/minio", () => ({ fPutObject: jest.fn() }));

jest.mock("next-auth/react");
jest.mock("next-auth");
// This is tested further in the E2E tests
describe("/api/uploadResource", () => {
  test("must be logged in", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
    });
    await handleUploadResource(req, res);
    expect(res._getStatusCode()).toEqual(403);
  });

  test("body must be supplied with correct Content-Type", async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: "POST",
      body: { resourceFile: "foo" },
    });
    mockUserOnce(users.admin);
    await handleUploadResource(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });
});
