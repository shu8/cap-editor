import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from "crypto";

import prisma from '../../../lib/db';
import { formatFeedAsXML } from '../../../lib/xml/helpers';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(403).json({ success: false, message: 'You do not have permission to create alerts.' });
    }

    const { sender, sent = new Date().toISOString(), status, msgType, scope, info } = req.body;
    const { category, event, urgency, severity, certainty, resourceDesc, areaDesc } = info;

    const id = randomUUID();
    const alert = await prisma.alert.create({
      data: {
        id,
        data: {
          sender, sent, status, msgType, scope,
          info: {
            category, event, urgency, severity, certainty, resourceDesc, areaDesc
          }
        }
      }
    });

    return res.status(200).json({ success: true, id });
  }

  if (req.method === 'GET') {
    const alerts = await prisma.alert.findMany();

    if (req.query.json) {
      return res.json({ success: true, alerts });
    }

    return res
      .status(200)
      .setHeader('Content-Type', 'application/xml')
      .send(formatFeedAsXML(alerts));
  }
}
