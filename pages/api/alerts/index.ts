import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { randomUUID } from "crypto";

import prisma from '../../../lib/db';
import { authOptions } from '../auth/[...nextauth]';
import { formatFeedAsXML } from '../../../lib/xml/helpers';
import { CAPV12JSONSchema, CAPV12Schema } from '../../../lib/types/cap.schema';
import { validate as validateJSON } from 'jsonschema';
import { Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(403).json({ success: false, message: 'You do not have permission to create alerts.' });
    }

    const identifier = randomUUID();
    const alert: CAPV12JSONSchema = {
      identifier,
      sender: 'TODO',
      sent: new Date().toISOString(),
      status: req.body.status,
      msgType: req.body.msgType,
      // source
      scope: req.body.scope,
      ...(req.body.restriction && { restriction: req.body.restriction }),
      ...(req.body.addresses && { addresses: req.body.addresses?.map(a => `"${a}"`).join(' ') }),
      // code
      // note
      ...(req.body.references && { references: req.body.references?.join(' ') }),
      // incidents,
      info: [{
        // language
        category: req.body.category,
        event: req.body.event,
        responseType: req.body.actions,
        urgency: req.body.urgency,
        severity: req.body.severity,
        certainty: req.body.certainty,
        // audience
        // eventCode
        // effective
        onset: req.body.from,
        expires: req.body.to,
        // senderName
        headline: req.body.headline,
        description: req.body.description,
        instruction: req.body.instruction,
        // web
        // contact
        // parameter
        resource: [{
          resourceDesc: req.body.resourceDesc,
          mimeType: req.body.mimeType,
          // size
          // uri
          // drefUri
          // digest
        }],
        area: [{
          areaDesc: req.body.areaDesc,
          polygon: req.body.polygon,
          circle: req.body.circle,
          // geocode
          // altitude
          // ceiling
        }]

      }]
    };

    console.log(JSON.stringify(alert));

    const validationResult = validateJSON(alert, CAPV12Schema);

    if (!validationResult.valid) {
      console.error('Invalid alert', validationResult);
      return res.status(400).json({ success: false, message: 'Invalid alert' });
    }

    await prisma.alert.create({ data: { id: alert.identifier, data: alert as Prisma.InputJsonValue } });
    return res.status(200).json({ success: true, identifier });
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
