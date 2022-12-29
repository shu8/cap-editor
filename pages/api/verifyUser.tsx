import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { sendEmail } from "../../lib/email";
import { ERRORS } from "../../lib/errors";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    // TODO should this require being logged in? would the AA author always have an account already? If not, there would be a loop...
    const alertingAuthorityVerificationToken = req.body.verificationToken;
    if (!alertingAuthorityVerificationToken) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid verification token provided" });
    }

    const user = await prisma.user.findFirst({
      where: { alertingAuthorityVerificationToken },
      include: { alertingAuthority: { select: { name: true } } },
    });

    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid verification token provided" });
    }

    if (typeof req.body.verified !== "boolean") {
      return res.status(400).json({ error: true, message: "Invalid request" });
    }

    if (req.body.verified === false) {
      await sendEmail({
        subject: `Account verification rejected for ${user.alertingAuthority.name}`,
        to: user.email,
        text: `Your account was not approved for ${user.alertingAuthority.name}. As a result, your account has been deleted. Please try registering with a new account if you believe there has been a mistake or you would like to choose a different Alerting Authority.`,
        html: `Your account was not approved for ${user.alertingAuthority.name}. As a result, your account has been deleted. Please try registering with a new account if you believe there has been a mistake or you would like to choose a different Alerting Authority.`,
      });
      await prisma.user.delete({ where: { email: user.email } });
      return res.json({ error: false });
    }

    if (!req.body.roles?.length) {
      return res
        .status(400)
        .json({ error: true, message: "No roles supplied" });
    }

    // TODO ask verifying user what rights the new user should have (edit/publish/admin etc.)
    await prisma.user.update({
      where: { email: user.email },
      data: {
        alertingAuthorityVerificationToken: null,
        alertingAuthorityVerified: new Date(),
        roles: req.body.roles,
      },
    });

    await sendEmail({
      subject: `Account verification complete for ${user.alertingAuthority.name}`,
      to: user.email,
      text: `Your account has now been verified by your Alerting Authority!`,
      html: `Your account has now been verified by your Alerting Authority!`,
    });

    return res.redirect("/");
  }
}
