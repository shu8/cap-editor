import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { sendEmail } from "../../lib/email";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import { ApiError } from "next/dist/server/api-utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // TODO should this require being logged in? would the AA author always have an account already? If not, there would be a loop...
    const alertingAuthorityVerificationToken = req.body.verificationToken;
    if (!alertingAuthorityVerificationToken) {
      throw new ApiError(400, "You did not provide a valid verification token");
    }

    const user = await prisma.user.findFirst({
      where: { alertingAuthorityVerificationToken },
      include: { alertingAuthority: { select: { name: true } } },
    });

    if (!user) {
      throw new ApiError(400, "You did not provide a valid verification token");
    }

    if (typeof req.body.verified !== "boolean") {
      throw new ApiError(
        400,
        "You did not provide a valid verification result"
      );
    }

    if (req.body.verified === false) {
      await sendEmail({
        subject: `Account verification rejected for ${user.alertingAuthority.name}`,
        to: user.email,
        body: `Your account was not approved for ${user.alertingAuthority.name}. As a result, your account has been deleted. Please try registering with a new account if you believe there has been a mistake or you would like to choose a different Alerting Authority.`,
        title: "Account verification rejected",
        url: `https://${process.env.DOMAIN}`,
        urlText: "Visit the CAP Editor now",
      });

      await prisma.user.delete({ where: { email: user.email } });
      return res.json({ error: false });
    }

    if (!req.body.roles?.length) {
      throw new ApiError(
        400,
        "You did not provide valid roles for the new account"
      );
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
      body: "Your account has now been verified by your Alerting Authority!",
      title: "Account verified",
      url: `https://${process.env.DOMAIN}/login`,
      urlText: "Visit the CAP Editor now",
    });

    return res.redirect("/");
  }
}

export default withErrorHandler(handler);
