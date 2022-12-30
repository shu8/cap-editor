import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';

import { FormAlertData } from '../../../components/editor/Editor';
import prisma from '../../../lib/prisma';
import { sign } from '../../../lib/xml/sign';
import { authOptions } from '../auth/[...nextauth]';
import { CAPV12JSONSchema } from '../../../lib/types/cap.schema';
import { Prisma } from '@prisma/client';
import { mapFormAlertDataToCapSchema } from '../../../lib/cap';

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

    const alertData: FormAlertData = req.body.data;

    try {
      const newAlert: CAPV12JSONSchema = mapFormAlertDataToCapSchema(alertData, alertId);
      await prisma.alert.update({
        where: { id: alert.id },
        data: {
          data: newAlert as Prisma.InputJsonValue,
          status: req.body.status,
        }
      });

      return res.status(200).json({ error: false });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: 'Invalid new alert details' });
    }
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
