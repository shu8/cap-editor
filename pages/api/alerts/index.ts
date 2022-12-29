import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { randomUUID } from "crypto";

import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { formatFeedAsXML } from '../../../lib/xml/helpers';
import { CAPV12JSONSchema, CAPV12Schema } from '../../../lib/types/cap.schema';
import { validate as validateJSON } from 'jsonschema';
import { Prisma } from '@prisma/client';
import { AlertData } from '../../../components/editor/NewAlert';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(403).json({ success: false, message: 'You are not logged in' });
    }

    // i.e., if they are only a VALIDATOR, then they can only publish existing drafted alerts (not POST new ones)
    if (!session.user.roles.includes('ADMIN') && !session.user.roles.includes('EDITOR')) {
      return res.status(403).json({ success: false, message: 'You do not have permission to create new alerts' });
    }

    const identifier = randomUUID();
    const alertData: AlertData = req.body.data;

    // Type as `any` for now, because we will validate against the JSON schema next
    // Typecast as `AlertData` when JSON schema validation is successful
    const alert: any = {
      identifier,
      sender: 'TODO',
      sent: new Date().toISOString(),
      status: alertData.status,
      msgType: alertData.msgType,
      // source
      scope: alertData.scope,
      ...(alertData.restriction && { restriction: alertData.restriction }),
      ...(alertData.addresses && { addresses: alertData.addresses?.map(a => `"${a}"`).join(' ') }),
      // code
      // note
      ...(alertData.references && { references: alertData.references?.join(' ') }),
      // incidents,
      info: [{
        // language
        category: alertData.category,
        event: alertData.event,
        responseType: alertData.actions,
        urgency: alertData.urgency,
        severity: alertData.severity,
        certainty: alertData.certainty,
        // audience
        // eventCode
        // effective
        onset: alertData.from,
        expires: alertData.to,
        // senderName
        headline: alertData.headline,
        description: alertData.description,
        instruction: alertData.instruction,
        web: `https://${process.env.DOMAIN}/feed/${identifier}`,
        // contact
        // parameter
        // resource: [{
        //   resourceDesc: alertData.resourceDesc,
        //   mimeType: alertData.mimeType,
        //   // size
        //   // uri
        //   // drefUri
        //   // digest
        // }],
        area: [{
          areaDesc: Object.keys(alertData.regions).join(', '),
          circle: Object.values(alertData.regions).filter(data => typeof data === 'string'),
          polygon: Object.values(alertData.regions).filter(data => typeof data !== 'string'),
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

    await prisma.alert.create({
      data: {
        id: alert.identifier,
        data: alert as Prisma.InputJsonValue,
        creator: { connect: { email: session.user.email } },
        status: req.body.status ?? 'DRAFT',
      }
    });
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
