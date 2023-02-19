import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes, randomUUID } from "crypto";
import { AlertingAuthority } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

import prisma from "../../../lib/prisma";
import { sendEmail } from "../../../lib/email";
import { fetchWMOAlertingAuthorities } from "../../../lib/helpers.server";
import { withErrorHandler } from "../../../lib/apiErrorHandler";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

async function handleConnectToAlertingAuthority(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const { alertingAuthorityId } = req.body;
  if (!alertingAuthorityId) {
    throw new ApiError(
      400,
      "You did not provide the Alerting Authority you wish to connect to"
    );
  }

  const alertingAuthority: AlertingAuthority | undefined =
    alertingAuthorityId === "other"
      ? {
          author: process.env.IFRC_AA_VERIFIER_EMAIL,
          id: `ifrc:${randomUUID()}`,
          name: "Other Alerting Authority",
          countryCode: null,
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

  const alertingAuthorityVerificationToken = randomBytes(32).toString("hex");
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      UserAlertingAuthorities: {
        create: {
          alertingAuthority: {
            connectOrCreate: {
              // TODO alertingAuthority.polygon isn't given for all AAs by WMO
              create: alertingAuthority,
              where: { id: alertingAuthority.id },
            },
          },
          // TODO hash the token in the db
          alertingAuthorityVerificationToken,
        },
      },
    },
  });

  // TODO what if the registering user _is_ the AA author? skip this step?
  await sendEmail({
    subject: `New user registered for ${alertingAuthority.name}`,
    to: alertingAuthority.author,
    body: `Please verify this user has permission to create alerts for your Alerting Authority`,
    url: `${process.env.BASE_URL}/verify?token=${alertingAuthorityVerificationToken}`,
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
