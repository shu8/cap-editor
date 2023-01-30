import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { jest } from "@jest/globals";
import { prismaMock } from "./setup";
import { randomUUID } from "crypto";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate } from "../../lib/helpers.client";

export const mockUserOnce = (mockUserDetails) => {
  const originalModuleClient = jest.requireActual("next-auth/react") as any;
  const originalModuleServer = jest.requireActual("next-auth") as any;
  const mockSession = {
    user: mockUserDetails,
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
  };

  if (!mockUserDetails) {
    useSession.mockReturnValueOnce({ data: null, status: "unauthenticated" });
    unstable_getServerSession.mockReturnValueOnce(null);
    return;
  }

  useSession.mockReturnValueOnce(
    mockUserDetails
      ? { data: mockSession, status: "authenticated" }
      : originalModuleClient.useSession
  );

  unstable_getServerSession.mockReturnValueOnce(
    mockUserDetails
      ? mockSession
      : originalModuleServer.unstable_getServerSession
  );
};

export const users = {
  editor: {
    email: "editor@example.com",
    name: "Editor",
    image: "",
    roles: ["EDITOR"],
  },
  validator: {
    email: "validator@example.com",
    name: "Validator",
    image: "",
    roles: ["VALIDATOR"],
  },
  admin: {
    email: "admin@example.com",
    name: "Admin",
    image: "",
    roles: ["ADMIN"],
  },
};

export const createUser = async ({
  roles = ["ADMIN"],
  email = "admin@example.com",
  name = "Foo",
  alertingAuthority = {
    author: "aa@example.com",
    countryCode: "GB",
    id: "aa",
    name: "AA",
  },
} = {}) => {
  return await prismaMock.user.create({
    data: {
      email,
      name,
      roles,
      alertingAuthorityVerificationToken: "token",
      alertingAuthority: {
        connectOrCreate: {
          create: alertingAuthority,
          where: { id: alertingAuthority.id },
        },
      },
    },
  });
};

export const createAlert = async ({ status = "PUBLISHED" } = {}) => {
  const future = new Date();
  future.setDate(future.getDate() + 1);
  const uuid = randomUUID();
  const user = await createUser();

  return await prismaMock.alert.create({
    data: {
      id: uuid,
      status,
      userId: user.id,
      data: mapFormAlertDataToCapSchema(
        {
          category: ["Geo"],
          regions: {},
          from: formatDate(new Date()),
          to: formatDate(future),
          actions: ["Shelter"],
          certainty: "Observed",
          severity: "Extreme",
          urgency: "Immediate",
          status: "Actual",
          msgType: "Alert",
          scope: "Public",
          restriction: "",
          addresses: [],
          references: [],
          textLanguages: {
            en: {
              event: "Test",
              headline: "Test",
              description: "Test",
              instruction: "Test",
              resources: [],
            },
          },
        },
        uuid
      ),
    },
  });
};
