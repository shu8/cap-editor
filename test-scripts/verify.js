import { webcrypto } from 'node:crypto';
import xmldsigjs from 'xmldsigjs';

import { formatAlertAsXML } from "../lib/xmlHelpers.js";
import { getPublicKey } from "../lib/crypto.js";

xmldsigjs.Application.setEngine("OpenSSL", webcrypto);

app.get('/alerts/verify/:id', async (request, reply) => {
  const alert = await app.mongo.db.collection('alerts').findOne({ id: request.params.id });
  const alertXml = xmldsigjs.Parse(formatAlertAsXML(alert));
  const signed = new xmldsigjs.SignedXml(alertXml);
  const publicKey = await getPublicKey();

  const isValid = await signed.Verify(publicKey)
    .catch(e => console.log(e));

  return { valid: isValid };
});
