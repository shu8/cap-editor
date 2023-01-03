import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth';
import { Prisma } from '@prisma/client';
import { ApiError } from 'next/dist/server/api-utils';

import { FormAlertData } from '../../../components/editor/Editor';
import prisma from '../../../lib/prisma';
import { sign } from '../../../lib/xml/sign';
import { authOptions } from '../auth/[...nextauth]';
import { CAPV12JSONSchema } from '../../../lib/types/cap.schema';
import { mapFormAlertDataToCapSchema } from '../../../lib/cap';
import { formatAlertAsXML } from '../../../lib/xml/helpers';
import { withErrorHandler } from '../../../lib/apiErrorHandler';

async function handleUpdateAlert(req: NextApiRequest, res: NextApiResponse, alertId: string | string[] | undefined) {
  if (typeof alertId !== 'string') {
    throw new ApiError(400, 'You did not provide a valid Alert ID');
  }

  if (!['TEMPLATE', 'PUBLISHED', 'DRAFT'].includes(req.body.status)) {
    throw new ApiError(400, 'You did not provide a valid alert status');
  }

  const session = await unstable_getServerSession(req, res, authOptions);

  if (!session) {
    throw new ApiError(401, 'You are not logged ins');
  }

  // i.e., only admins and validators can publish an existing alert
  if (req.body.status === 'PUBLISHED' && (!session.user.roles.includes('ADMIN') && !session.user.roles.includes('VALIDATOR'))) {
    throw new ApiError(403, 'You do not have permission to publish new alerts');
  }

  const alert = await prisma.alert.findFirst({ where: { id: alertId } });

  if (!alert) {
    throw new ApiError(404, 'You did not provide a valid alert ID');
  }

  // i.e., nobody can edit an already-published alert
  if (alert.status === 'PUBLISHED') {
    throw new ApiError(403, 'You cannot edit an alert that has already been published');
  }

  // i.e., only admins and editors can edit a template
  if (alert.status === 'TEMPLATE' && (!session.user.roles.includes('ADMIN') && !session.user.roles.includes('EDITOR'))) {
    throw new ApiError(403, 'You do not have permission to edit template alerts');
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
    throw new ApiError(400, 'You did not provide valid alert details');
  }
}

async function handleGetAlert(req: NextApiRequest, res: NextApiResponse, alertId: string | string[] | undefined) {
  if (typeof alertId !== 'string') {
    return res.redirect('/feed');
  }

  try {
    const alert = await prisma.alert.findFirst({ where: { id: alertId } });

    if (!alert) throw 'Unknown alert';

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertId } = req.query;

  if (req.method === 'PUT') {
    return handleUpdateAlert(req, res, alertId);
  }

  if (req.method === 'GET') {
    return handleGetAlert(req, res, alertId);
  }

  return res.status(405);
}

export default withErrorHandler(handler);
