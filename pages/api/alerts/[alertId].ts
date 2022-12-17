import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/db';
import { sign } from '../../../lib/xml/sign';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'GET') {
    const { alertId } = req.query;

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
