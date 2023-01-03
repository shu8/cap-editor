import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { AlertingAuthority } from "@prisma/client";
import prisma from '../../lib/prisma';
import { sendEmail } from "../../lib/email";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import { ApiError } from "next/dist/server/api-utils";

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, alertingAuthorityId } = req.body;

    const alertingAuthorities: AlertingAuthority[] = await fetchWMOAlertingAuthorities();
    const alertingAuthority = alertingAuthorities.find(a => a.id === alertingAuthorityId);

    if (!alertingAuthority) {
      throw new ApiError(400, 'You did not choose a valid Alerting Authority');
    }

    const alertingAuthorityVerificationToken = randomBytes(32).toString('hex');
    await prisma.user.create({
      data: {
        name,
        email,
        // TODO hash the token in the db
        alertingAuthorityVerificationToken,
        alertingAuthority: {
          connectOrCreate: {
            where: { id: alertingAuthority.id },
            create: {
              id: alertingAuthority.id,
              name: alertingAuthority.name,
              author: alertingAuthority.author,
              countryCode: alertingAuthority.countryCode,
              // TODO polygon isn't given for all AAs by WMO
              polygon: alertingAuthority.polygon
            },
          }
        }
      }
    });

    // TODO what if the registering user _is_ the AA author? skip this step?
    await sendEmail({
      subject: `New user registered for ${alertingAuthority.name}`,
      to: alertingAuthority.author,
      body: `Please verify this user has permission to create alerts for your Alerting Authority`,
      url: `https://${process.env.DOMAIN}/verify?token=${alertingAuthorityVerificationToken}`,
      urlText: 'Verify user now',
      title: 'New user verification required'
    });

    return res.json({ error: false });
  }
}

export default withErrorHandler(handler);
