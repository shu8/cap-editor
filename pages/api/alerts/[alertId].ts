import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { validate as validateJSON } from 'jsonschema';

import { FormAlertData } from '../../../components/editor/Editor';
import prisma from '../../../lib/prisma';
import { sign } from '../../../lib/xml/sign';
import { authOptions } from '../auth/[...nextauth]';
import { CAPV12Schema } from '../../../lib/types/cap.schema';
import { Prisma } from '@prisma/client';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { alertId } = req.query;

  if (req.method === 'PUT') {
    if (typeof alertId !== 'string') {
      return res.status(400).json({ error: true, message: 'Invalid request' });
    }

    if (!['TEMPLATE', 'PUBLISHED', 'DRAFT'].includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Invalid request' });
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(403).json({ error: true, message: 'You are not logged in' });
    }

    // i.e., only admins and validators can publish an existing alert
    if (req.body.status === 'PUBLISHED' && (!session.user.roles.includes('ADMIN') && !session.user.roles.includes('VALIDATOR'))) {
      return res.status(403).json({ error: true, message: 'You do not have permission to publish new alerts' });
    }

    const alert = await prisma.alert.findFirst({ where: { id: alertId } });

    if (!alert) {
      return res.status(404).json({ error: true, message: 'Invalid alert ID' });
    }

    // i.e., nobody can edit an already-published alert
    if (alert.status === 'PUBLISHED') {
      return res.status(403).json({ error: true, message: 'You cannot edit an alert that has already been published' });
    }

    // i.e., only admins and editors can edit a template
    if (alert.status === 'TEMPLATE' && (!session.user.roles.includes('ADMIN') && !session.user.roles.includes('EDITOR'))) {
      return res.status(403).json({ error: true, message: 'You do not have permission to edit template alerts' });
    }

    const newAlertData: FormAlertData = req.body.data;

    // Type as `any` for now, because we will validate against the JSON schema next
    // Typecast as `CAPV12Schema` when JSON schema validation is successful
    const newAlert: any = {
      identifier: alertId,
      sender: alert.data?.sender,
      sent: new Date().toISOString(),
      status: newAlertData.status,
      msgType: newAlertData.msgType,
      // source
      scope: newAlertData.scope,
      ...(newAlertData.restriction && { restriction: newAlertData.restriction }),
      ...(newAlertData.addresses && { addresses: newAlertData.addresses?.map(a => `"${a}"`).join(' ') }),
      // code
      // note
      ...(newAlertData.references && { references: newAlertData.references?.join(' ') }),
      // incidents,
      info: [{
        // language
        category: newAlertData.category,
        event: newAlertData.event,
        responseType: newAlertData.actions,
        urgency: newAlertData.urgency,
        severity: newAlertData.severity,
        certainty: newAlertData.certainty,
        // audience
        // eventCode
        // effective
        onset: newAlertData.from,
        expires: newAlertData.to,
        // senderName
        headline: newAlertData.headline,
        description: newAlertData.description,
        instruction: newAlertData.instruction,
        web: alert.data?.web,
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
          areaDesc: Object.keys(newAlertData.regions).join(', '),
          circle: Object.values(newAlertData.regions).filter(data => typeof data === 'string'),
          polygon: Object.values(newAlertData.regions).filter(data => typeof data !== 'string'),
          // geocode
          // altitude
          // ceiling
        }]
      }]
    };

    console.log(JSON.stringify(newAlert));

    const validationResult = validateJSON(newAlert, CAPV12Schema);
    if (!validationResult.valid) {
      console.error('Invalid alert', validationResult);
      return res.status(400).json({ success: false, message: 'Invalid new alert details' });
    }

    await prisma.alert.update({
      where: { id: alert.id },
      data: {
        data: newAlert as Prisma.InputJsonValue,
        status: req.body.status ?? 'DRAFT',
      }
    });

    return res.status(200).json({ error: false });
  }

  if (req.method === 'GET') {
    if (typeof alertId !== 'string') {
      return res.redirect('/feed');
    }

    try {
      const alert = await prisma.alert.findFirst({ where: { id: alertId } });

      if (!alert) {
        throw 'Unknown alert';
      }

      const signedXML = await sign(alert);
      return res
        .status(200)
        .setHeader('Content-Type', 'application/xml')
        .send(signedXML.toString());
    }
    catch (err) {
      console.error(err);
      return res.status(500).send('Failed to sign alert');
    }
  }
}
