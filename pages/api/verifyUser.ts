import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../lib/apiErrorHandler";
import { REDIS_KEY_PENDING_SESSION_UPDATES } from "../../lib/constants";
import { sendEmail } from "../../lib/email";
import { hash } from "../../lib/helpers.server";
import prisma from "../../lib/prisma";
import redis from "../../lib/redis";

async function handleVerifyUser(req: NextApiRequest, res: NextApiResponse) {
  const { verificationToken } = req.body;
  if (!verificationToken) {
    throw new ApiError(400, "You did not provide a valid verification token");
  }

  if (typeof req.body.verified !== "boolean") {
    throw new ApiError(400, "You did not provide a valid verification result");
  }

  const userAndAlertingAuthority =
    await prisma.userAlertingAuthorities.findFirst({
      where: { verificationToken: hash(verificationToken) },
      include: {
        AlertingAuthority: { select: { name: true, id: true } },
        User: { select: { email: true } },
      },
    });

  if (!userAndAlertingAuthority) {
    throw new ApiError(400, "You did not provide a valid verification token");
  }

  if (req.body.verified === false) {
    await sendEmail({
      subject: `Account verification rejected for ${userAndAlertingAuthority.AlertingAuthority.name}`,
      to: userAndAlertingAuthority.User.email,
      body: `Your account was not approved for ${userAndAlertingAuthority.AlertingAuthority.name}. As a result, your account has been deleted. Please try registering with a new account if you believe there has been a mistake or you would like to choose a different Alerting Authority.`,
      title: "Account verification rejected",
      url: `${process.env.BASE_URL}`,
      urlText: "Visit the CAP Editor now",
    });

    await prisma.userAlertingAuthorities.delete({
      where: {
        userId_alertingAuthorityId: {
          alertingAuthorityId: userAndAlertingAuthority.AlertingAuthority.id,
          userId: userAndAlertingAuthority.userId,
        },
      },
    });

    return res.json({ error: false });
  }

  if (!req.body.roles?.length) {
    throw new ApiError(
      400,
      "You did not provide valid roles for the new account"
    );
  }

  await prisma.userAlertingAuthorities.update({
    where: {
      userId_alertingAuthorityId: {
        alertingAuthorityId: userAndAlertingAuthority.AlertingAuthority.id,
        userId: userAndAlertingAuthority.userId,
      },
    },
    data: {
      verificationToken: null,
      verified: new Date(),
      roles: req.body.roles,
    },
  });

  // Update this user's session when they next fetch it (so they don't have to re-login)
  await redis.SADD(
    REDIS_KEY_PENDING_SESSION_UPDATES,
    userAndAlertingAuthority.User.email
  );

  await sendEmail({
    subject: `Account verification complete for ${userAndAlertingAuthority.AlertingAuthority.name}`,
    to: userAndAlertingAuthority.User.email,
    body: "Your account has now been verified by your Alerting Authority!",
    title: "Account verified",
    url: `${process.env.BASE_URL}/login`,
    urlText: "Visit the CAP Editor now",
  });

  return res.json({ error: false });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleVerifyUser(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
