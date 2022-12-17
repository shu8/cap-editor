import type { NextApiRequest, NextApiResponse } from 'next';
import db from '../../../lib/db';
import { sign } from '../../../lib/sign';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  if (req.method === 'GET') {
    try {
      const alert = await (await db).db('cap-editor').collection('alerts').findOne({ id: req.query.alertId });
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
