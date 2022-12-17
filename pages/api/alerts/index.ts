import type { NextApiRequest, NextApiResponse } from 'next';
import { randomUUID } from "crypto";

import db from '../../../lib/db';
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
    const alert = await (await db).db('cap-editor').collection('alerts').insertOne({
      id,
      sender, sent, status, msgType, scope,
      info: {
        category, event, urgency, severity, certainty, resourceDesc, areaDesc
      }
    });

    return res.status(200).json({ success: true, id });
  }

  if (req.method === 'GET') {
    const alertsCursor = (await db).db('cap-editor').collection('alerts').find();
    const alerts = await alertsCursor.toArray();

    return res
      .status(200)
      .setHeader('Content-Type', 'application/xml')
      .send(formatFeedAsXML(alerts));
  }
}
