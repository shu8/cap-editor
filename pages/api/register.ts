import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/db';
import { sendEmail } from "../../lib/email";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";
import { AlertingAuthority } from "../../lib/types";
import { randomBytes } from "crypto";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, alertingAuthorityId } = req.body;

    const alertingAuthorities: AlertingAuthority[] = await fetchWMOAlertingAuthorities();
    const alertingAuthority = alertingAuthorities.find(a => a.id === alertingAuthorityId);

    if (!alertingAuthority) {
      return res.status(400).json({ success: false, error: 'Unknown Alerting Authority' });
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
      text: `Please verify this user has permission to create alerts for your Alerting Authority: https://${process.env.DOMAIN}/verify/${alertingAuthorityVerificationToken}`,
      html: `Please verify this user has permission to create alerts for your Alerting Authority: <a href="https://${process.env.DOMAIN}/verify/${alertingAuthorityVerificationToken}">Click here</a>`,
    });

    return res.json({ success: true });
  }
}
