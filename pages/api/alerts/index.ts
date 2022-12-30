import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { randomUUID } from "crypto";

import prisma from '../../../lib/prisma';
import { authOptions } from '../auth/[...nextauth]';
import { formatFeedAsXML } from '../../../lib/xml/helpers';
import { CAPV12JSONSchema, CAPV12Schema } from '../../../lib/types/cap.schema';
import { Prisma } from '@prisma/client';
import { FormAlertData } from '../../../components/editor/Editor';
import { mapFormAlertDataToCapSchema } from '../../../lib/cap';

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

    try {
      const alert: CAPV12JSONSchema = mapFormAlertDataToCapSchema(alertData, identifier);
      await prisma.alert.create({
        data: {
          id: alert.identifier,
          data: alert as Prisma.InputJsonValue,
          creator: { connect: { email: session.user.email } },
          status: req.body.status,
        }
      });
      return res.status(200).json({ success: true, identifier });
    } catch (err) {
      console.error(err);
      return res.status(400).json({ success: false, message: 'Invalid alert' });
    }
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
