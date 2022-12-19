import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import prisma from "../../../lib/db";
import { sendEmail } from "../../../lib/email";
import { ERRORS } from "../../../lib/errors";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    if (!session) {
      return res.redirect("/login");
    }

    // TODO ask AA to confirm which privileges (draft/edit/publish) this user will have
    const alertingAuthorityVerificationToken = req.query.verificationToken;
    if (typeof alertingAuthorityVerificationToken !== "string") {
      return res.redirect(`/error/${ERRORS.INVALID_VERIFICATION_TOKEN.slug}`);
    }

    const user = await prisma.user.findFirst({
      where: { alertingAuthorityVerificationToken },
      include: { alertingAuthority: { select: { name: true } } },
    });

    if (!user) {
      return res.redirect(`/error/${ERRORS.INVALID_VERIFICATION_TOKEN.slug}`);
    }

    await prisma.user.update({
      where: { email: user.email },
      data: {
        alertingAuthorityVerificationToken: null,
        alertingAuthorityVerified: new Date(),
      },
    });

    await sendEmail({
      subject: `Account verification complete for ${user.alertingAuthority.name}`,
      to: user.email,
      text: `Your account has now been verified by your Alerting Authority!`,
      html: `Your account has now been verified by your Alerting Authority`,
    });

    return res.redirect("/");
  }
}
