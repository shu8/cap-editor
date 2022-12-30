import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { randomUUID } from "crypto";

import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { formatFeedAsXML } from '../../../lib/xml/helpers';
import { CAPV12Schema } from '../../../lib/types/cap.schema';
import { validate as validateJSON } from 'jsonschema';
import { Prisma } from '@prisma/client';
import { FormAlertData } from '../../../components/editor/Editor';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    if (!['TEMPLATE', 'PUBLISHED', 'DRAFT'].includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(403).json({ success: false, message: 'You are not logged in' });
    }

    // i.e., if they are only a VALIDATOR, then they can only publish existing drafted alerts (not POST new ones)
    if (!session.user.roles.includes('ADMIN') && !session.user.roles.includes('EDITOR')) {
      return res.status(403).json({ success: false, message: 'You do not have permission to create new alerts' });
    }

    // i.e., only admins can request to publish a new alert (a validator must update the status of an existing alert and an editor can only edit drafts/templates)
    if (!session.user.roles.includes('ADMIN') && req.body.status === 'PUBLISHED') {
      return res.status(403).json({ success: false, message: 'You do not have permission to publish new alerts' });
    }

    const identifier = randomUUID();
    const alertData: FormAlertData = req.body.data;

    // Type as `any` for now, because we will validate against the JSON schema next
    // Typecast as `CAPV12Schema` when JSON schema validation is successful
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

    // JSON returns all alerts (inc. draft and template), as long as you are logged in
    if (req.query.json) {
      const session = await unstable_getServerSession(req, res, authOptions);
      if (!session) return res.status(403).json({ error: true, message: 'You are not logged in' });

      return res.json({ error: false, alerts });
    }

    // Standard XML feed contains only active published alerts that haven't expired
    return res
      .status(200)
      .setHeader('Content-Type', 'application/xml')
      .send(formatFeedAsXML(alerts.filter(a =>
        a.status === 'PUBLISHED' &&
        new Date(a.data?.info?.[0]?.expires) >= new Date()
      )));
  }
}
