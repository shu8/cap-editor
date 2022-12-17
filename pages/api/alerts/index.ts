import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from "crypto";

import prisma from '../../../lib/db';
import { formatFeedAsXML } from '../../../lib/xmlHelpers';

type SubmitAlertResult = {
  success: Boolean;
  id?: String;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SubmitAlertResult | String>
) {
  if (req.method === 'POST') {
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

    return res
      .status(200)
      .setHeader('Content-Type', 'application/xml')
      .send(formatFeedAsXML(alerts));
  }
}
