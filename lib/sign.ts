import { Application, Parse, SignedXml } from 'xmldsigjs';
import { webcrypto } from 'node:crypto';

import { formatAlertAsXML } from "./xmlHelpers";
import { getPrivateKey } from './crypto';

Application.setEngine("OpenSSL", webcrypto);

export async function sign(alert) {
  const alertXml = Parse(formatAlertAsXML(alert));
  const signed = new SignedXml(alertXml);
  const privateKey = await getPrivateKey();

  await signed.Sign(
    { name: "ECDSA", hash: 'SHA-512' },
    privateKey,
    alertXml,
    {
      references: [{ hash: "SHA-512", transforms: ["enveloped", "c14n"] }]
    });

  return signed.toString();
}
