import { webcrypto } from "node:crypto";
import { Application, Parse, SignedXml } from "xmldsigjs";

import { Alert } from ".prisma/client";
import { getPrivateKey } from "../crypto";
import { formatAlertAsXML } from "./helpers";
import { CAPV12JSONSchema } from "../types/cap.schema";

Application.setEngine("OpenSSL", webcrypto);

export async function sign(alert: Alert) {
  const alertXml = Parse(formatAlertAsXML(alert.data as CAPV12JSONSchema));
  const signed = new SignedXml(alertXml);
  const privateKey = await getPrivateKey();
  if (!privateKey) return null;

  await signed.Sign({ name: "ECDSA", hash: "SHA-512" }, privateKey, alertXml, {
    references: [{ hash: "SHA-512", transforms: ["enveloped", "c14n"] }],
  });

  return signed.toString();
}
