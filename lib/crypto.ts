import { exec } from "child_process";
import fs from "fs";
import { webcrypto } from "node:crypto";
import path from "path";

const walk = (dir: string, desiredFilename: string): string | null => {
  const files = fs.readdirSync(dir);
  for (const filename of files) {
    const filepath = path.join(dir, filename);
    if (filename === desiredFilename) {
      return filepath;
    }

    if (fs.statSync(filepath).isDirectory()) {
      const found = walk(filepath, desiredFilename);
      if (found) return found;
    }
  }
  return null;
};

const convertTraditionalEcToPkcs8 = async (
  privateKeyPath: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(
      `openssl pkcs8 -topk8 -in ${privateKeyPath} -nocrypt`,
      (error, stdout) => {
        if (error) return reject(error);
        resolve(stdout);
      }
    );
  });

export const getPrivateKey = async () => {
  const privateKeyPath = walk(
    process.env.TLS_DIRECTORY,
    process.env.PRIVATE_KEY_FILENAME
  );
  if (!privateKeyPath) return null;

  let privateKey = fs.readFileSync(privateKeyPath, "utf-8");

  if (privateKey.startsWith("-----BEGIN EC PRIVATE KEY")) {
    privateKey = await convertTraditionalEcToPkcs8(privateKeyPath);
  }

  privateKey = privateKey.replace(/-----(BEGIN|END) PRIVATE KEY-----\n?/g, "");

  return webcrypto.subtle.importKey(
    "pkcs8",
    Buffer.from(privateKey, "base64"),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );
};
