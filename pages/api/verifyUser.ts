import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../lib/apiErrorHandler";
import { sendEmail } from "../../lib/email";
import prisma from "../../lib/prisma";
import redis from "../../lib/redis";

async function handleVerifyUser(req: NextApiRequest, res: NextApiResponse) {
  const alertingAuthorityVerificationToken = req.body.verificationToken;
  if (!alertingAuthorityVerificationToken) {
    throw new ApiError(400, "You did not provide a valid verification token");
  }

  if (typeof req.body.verified !== "boolean") {
    throw new ApiError(400, "You did not provide a valid verification result");
  }

  const userAndAlertingAuthority =
    await prisma.userAlertingAuthorities.findFirst({
      where: { alertingAuthorityVerificationToken },
      include: {
        alertingAuthority: { select: { name: true, id: true } },
        user: { select: { email: true } },
      },
    });

  if (!userAndAlertingAuthority) {
    throw new ApiError(400, "You did not provide a valid verification token");
  }

  if (req.body.verified === false) {
    await sendEmail({
      subject: `Account verification rejected for ${userAndAlertingAuthority.alertingAuthority.name}`,
      to: userAndAlertingAuthority.user.email,
      body: `Your account was not approved for ${userAndAlertingAuthority.alertingAuthority.name}. As a result, your account has been deleted. Please try registering with a new account if you believe there has been a mistake or you would like to choose a different Alerting Authority.`,
      title: "Account verification rejected",
      url: `${process.env.BASE_URL}`,
      urlText: "Visit the CAP Editor now",
    });

    await prisma.userAlertingAuthorities.delete({
      where: {
        userId_alertingAuthorityId: {
          alertingAuthorityId: userAndAlertingAuthority.alertingAuthority.id,
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

  const isCustomAA =
    userAndAlertingAuthority.alertingAuthorityId.startsWith("ifrc:");
  if (isCustomAA && !req.body.name) {
    throw new ApiError(
      400,
      "You did not provide a valid name for this new IFRC-managed Alerting Authority"
    );
  }

  await prisma.userAlertingAuthorities.update({
    where: {
      userId_alertingAuthorityId: {
        alertingAuthorityId: userAndAlertingAuthority.alertingAuthority.id,
        userId: userAndAlertingAuthority.userId,
      },
    },
    data: {
      alertingAuthorityVerificationToken: null,
      alertingAuthorityVerified: new Date(),
      roles: req.body.roles,
      ...(isCustomAA && {
        alertingAuthority: { update: { name: req.body.name } },
      }),
    },
  });

  // Update this user's session when they next fetch it (so they don't have to re-login)
  await redis.SADD(
    "pendingSessionUpdates",
    userAndAlertingAuthority.user.email
  );

  await sendEmail({
    subject: `Account verification complete for ${userAndAlertingAuthority.alertingAuthority.name}`,
    to: userAndAlertingAuthority.user.email,
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
