import type { NextApiRequest, NextApiResponse } from "next";
import prisma from '../../lib/db';
import { sendEmail } from "../../lib/email";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";
import { AlertingAuthority } from "../../lib/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, alertingAuthorityId } = req.body;

    const alertingAuthorities: AlertingAuthority[] = await fetchWMOAlertingAuthorities();
    const alertingAuthority = alertingAuthorities.find(a => a.id === alertingAuthorityId);

    if (!alertingAuthority) {
      return res.status(400).json({ success: false, error: 'Unknown Alerting Authority' });
    }

    await prisma.user.create({
      data: {
        name,
        email,
        alertingAuthority: {
          connectOrCreate: {
            where: { id: alertingAuthority.id },
            create: {
              id: alertingAuthority.id,
              name: alertingAuthority.name,
              author: alertingAuthority.author,
              countryCode: alertingAuthority.countryCode,
            },
          }
        }
      }
    });

    // TODO: email AA to confirm user identity
    await sendEmail({
      from: process.env.EMAIL_FROM,
      subject: `New user registered for ${alertingAuthority.name}`,
      to: alertingAuthority.author,
      text: 'Please verify this user has permission to create alerts for your Alerting Authority',
      html: 'Please verify this user has permission to create alerts for your Alerting Authority',
    });

    return res.json({ success: true });
  }
}
