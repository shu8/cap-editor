import { useSession } from "next-auth/react";
import { unstable_getServerSession } from "next-auth";
import { jest } from "@jest/globals";
import { prismaMock } from "./setup";
import { randomUUID } from "crypto";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate } from "../../lib/helpers.client";
import { Role } from "@prisma/client";

export const mockUserOnce = (mockUserDetails) => {
  const originalModuleClient = jest.requireActual("next-auth/react") as any;
  const originalModuleServer = jest.requireActual("next-auth") as any;

  if (mockUserDetails.alertingAuthority) {
    mockUserDetails.alertingAuthorities = {
      [mockUserDetails.alertingAuthority.id]: mockUserDetails.alertingAuthority,
    };
  }

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

const defaultAlertingAuthority = {
  id: "aa",
  name: "AA",
  countryCode: "GB",
  roles: ["ADMIN"],
  author: "aa@example.com",
};

export const users = {
  editor: {
    email: "editor@example.com",
    name: "Editor",
    image: "",
    alertingAuthority: defaultAlertingAuthority,
    roles: ["EDITOR"],
  },
  validator: {
    email: "validator@example.com",
    name: "Validator",
    image: "",
    alertingAuthority: defaultAlertingAuthority,
    roles: ["VALIDATOR"],
  },
  admin: {
    email: "admin@example.com",
    name: "Admin",
    image: "",
    alertingAuthority: defaultAlertingAuthority,
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
  alertingAuthorityVerified = false,
} = {}) => {
  return await prismaMock.user.create({
    data: {
      email,
      name,
      UserAlertingAuthorities: {
        create: {
          alertingAuthority: {
            connectOrCreate: {
              create: {
                id: alertingAuthority.id,
                name: alertingAuthority.name,
                countryCode: alertingAuthority.countryCode,
                author: alertingAuthority.author,
              },
              where: { id: alertingAuthority.id },
            },
          },
          ...(alertingAuthorityVerified && {
            alertingAuthorityVerified: new Date(),
          }),
          ...(!alertingAuthorityVerified && {
            alertingAuthorityVerificationToken: "token",
          }),
          roles: roles as Role[],
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
