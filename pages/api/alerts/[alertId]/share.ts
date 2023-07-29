import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import { sendEmail } from "../../../../lib/email";
import prisma from "../../../../lib/prisma";
import { authOptions } from "../../auth/[...nextauth]";

async function handleShareAlert(
  req: NextApiRequest,
  res: NextApiResponse,
  alertId: string | string[] | undefined
) {
  const { email } = req.body;

  if (typeof alertId !== "string") {
    throw new ApiError(400, "You did not provide a valid Alert ID");
  }

  if (!email) {
    throw new ApiError(
      400,
      "You did not provide a valid email address to share this Alert with"
    );
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const alert = await prisma.alert.findFirst({ where: { id: alertId } });
  if (!alert) throw new ApiError(404, "You did not provide a valid alert ID");

  const alertingAuthority =
    session.user.alertingAuthorities[alert.alertingAuthorityId];

  if (!alertingAuthority) {
    throw new ApiError(
      403,
      "You do not have permission to share alerts for this Alerting Authority"
    );
  }

  // i.e., only draft alerts can be shared
  if (alert.status !== "DRAFT") {
    throw new ApiError(403, "Only draft alerts can be shared");
  }

  // Give the user 24-hour access to the alert
  const expires = new Date();
  expires.setHours(expires.getHours() + 24);

  await prisma.sharedAlert.create({
    data: {
      Alert: { connect: { id: alert.id } },
      User: {
        connectOrCreate: {
          create: { email },
          where: { email },
        },
      },
      expires,
    },
  });

  await sendEmail({
    to: email,
    subject: "You have been invited to collaborate on an Alert",
    body: "Please login via the below link to collaborate on an Alert on the CAP Editor. Your access will expire in 24 hours.",
    url: `${process.env.BASE_URL}/login`,
    urlText: "Visit CAP Editor",
    title: "Invitation to collaborate on Alert",
  });

  return res.status(200).json({ error: false });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertId } = req.query;

  if (req.method === "POST") {
    return handleShareAlert(req, res, alertId);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
