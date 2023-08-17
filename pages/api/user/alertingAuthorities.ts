import { AlertingAuthority } from ".prisma/client";
import { randomBytes, randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../lib/apiErrorHandler";
import { sendEmail } from "../../../lib/email";
import { fetchWMOAlertingAuthorities, hash } from "../../../lib/helpers.server";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

async function handleConnectToAlertingAuthority(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const { alertingAuthorityId, name: customAlertingAuthorityName } = req.body;
  if (!alertingAuthorityId) {
    throw new ApiError(
      400,
      "You did not provide the Alerting Authority you wish to connect to"
    );
  }

  if (alertingAuthorityId === "other" && !customAlertingAuthorityName) {
    throw new ApiError(
      400,
      "You did not provide valid details for the Alerting Authority you wish to connect to"
    );
  }

  const alertingAuthority: AlertingAuthority | undefined =
    alertingAuthorityId === "other"
      ? {
          author: process.env.IFRC_AA_VERIFIER_EMAIL,
          id: `ifrc:${randomUUID()}`,
          name: customAlertingAuthorityName,
          countryCode: "Other",
          polygon: null,
        }
      : (await fetchWMOAlertingAuthorities()).find(
          (a) => a.id === alertingAuthorityId
        );

  if (!alertingAuthority) {
    throw new ApiError(400, "You did not choose a valid Alerting Authority");
  }

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
  });

  if (!user?.name) {
    throw new ApiError(
      401,
      "You must provide your name via the Settings page before you can connect to an Alerting Authority"
    );
  }

  const verificationToken = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      AlertingAuthorities: {
        create: {
          AlertingAuthority: {
            connectOrCreate: {
              create: alertingAuthority,
              where: { id: alertingAuthority.id },
            },
          },
          verificationToken: hash(verificationToken),
        },
      },
    },
  });

  // Note: if the registering user is the same as the author, they will still receive
  //  a verification email (as the AA author), where they can assign their own roles
  await sendEmail({
    subject: `New user registered for ${alertingAuthority.name}`,
    to: alertingAuthority.author,
    body: `Please verify this user has permission to create alerts for your Alerting Authority`,
    url: `${process.env.BASE_URL}/verify?token=${verificationToken}`,
    urlText: "Verify user now",
    title: "New user verification required",
  });

  return res.json({ error: false });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleConnectToAlertingAuthority(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
