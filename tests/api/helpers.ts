import { jest } from "@jest/globals";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { mapFormAlertDataToCapSchema } from "../../lib/cap";
import { formatDate } from "../../lib/helpers.client";
import { hash } from "../../lib/helpers.server";
import { prismaMock } from "./setup";

export const mockUserOnce = (mockUserDetails) => {
  const originalModuleClient = jest.requireActual("next-auth/react") as any;
  const originalModuleServer = jest.requireActual("next-auth") as any;

  const userDetails = mockUserDetails ? { ...mockUserDetails } : null;
  if (userDetails?.alertingAuthority) {
    userDetails.alertingAuthorities = {
      [mockUserDetails.alertingAuthority.id]: mockUserDetails.alertingAuthority,
    };
    delete userDetails.alertingAuthority;
  }

  if (!userDetails) {
    useSession.mockReturnValueOnce({ data: null, status: "unauthenticated" });
    getServerSession.mockReturnValueOnce(null);
    return;
  }

  const mockSession = {
    user: userDetails,
    expires: new Date(Date.now() + 2 * 86400).toISOString(),
  };

  useSession.mockReturnValueOnce(
    userDetails
      ? { data: mockSession, status: "authenticated" }
      : originalModuleClient.useSession
  );

  getServerSession.mockReturnValueOnce(
    userDetails ? mockSession : originalModuleServer.getServerSession
  );
};

const defaultAlertingAuthority = {
  id: "aa",
  name: "AA",
  countryCode: "GB",
  author: "aa@example.com",
  contact: "example@example.com",
  web: "https://example.com",
};

export const users = {
  composer: {
    email: "composer@example.com",
    name: "Composer",
    image: "",
    alertingAuthority: { ...defaultAlertingAuthority, roles: ["COMPOSER"] },
  },
  approver: {
    email: "approver@example.com",
    name: "Approver",
    image: "",
    alertingAuthority: { ...defaultAlertingAuthority, roles: ["APPROVER"] },
  },
  admin: {
    email: "admin@example.com",
    name: "Admin",
    image: "",
    alertingAuthority: { ...defaultAlertingAuthority, roles: ["ADMIN"] },
  },
};

export const createUser = async ({
  email = "admin@example.com",
  name = "Foo",
  alertingAuthority = defaultAlertingAuthority,
  alertingAuthorityVerified = false,
} = {}) => {
  return await prismaMock.user.create({
    data: {
      email,
      name,
      AlertingAuthorities: {
        create: {
          AlertingAuthority: {
            connectOrCreate: {
              create: {
                id: alertingAuthority.id,
                name: alertingAuthority.name,
                countryCode: alertingAuthority.countryCode,
                author: alertingAuthority.author,
                contact: alertingAuthority.contact,
                web: alertingAuthority.web,
              },
              where: { id: alertingAuthority.id },
            },
          },
          ...(alertingAuthorityVerified && {
            verified: new Date(),
          }),
          ...(!alertingAuthorityVerified && {
            verificationToken: hash("token"),
          }),
          roles: alertingAuthority.roles,
        },
      },
    },
  });
};

export const createAlert = async ({
  status = "PUBLISHED",
  userDetails = null,
} = {}) => {
  const future = new Date();
  future.setDate(future.getDate() + 1);
  const uuid = randomUUID();
  const user = userDetails ? await createUser(userDetails) : await createUser();

  return await prismaMock.alert.create({
    data: {
      id: uuid,
      status,
      alertingAuthorityId: "aa",
      userId: user.id,
      data: mapFormAlertDataToCapSchema(
        {
          name: "AA",
          author: "AA@example.com",
          web: "https://example.com",
          contact: "example@example.com",
        },
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
