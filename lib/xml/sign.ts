import { webcrypto } from "node:crypto";
import { Application, Parse, SignedXml } from "xmldsigjs";

import { Alert } from ".prisma/client";
import { getPrivateKey } from "../crypto";
import { formatAlertAsXML } from "./helpers";

Application.setEngine("OpenSSL", webcrypto);

export async function sign(alert: Alert) {
  const alertXml = Parse(formatAlertAsXML(alert));
  const signed = new SignedXml(alertXml);
  const privateKey = await getPrivateKey();

  await signed.Sign({ name: "ECDSA", hash: "SHA-512" }, privateKey, alertXml, {
    references: [{ hash: "SHA-512", transforms: ["enveloped", "c14n"] }],
  });

  return signed.toString();
}
