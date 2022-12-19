import fs from 'fs';
import { webcrypto } from 'node:crypto';
import path from 'path';

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

// ssh-keygen -m PKCS8 -t ecdsa
// TODO get the keys from the SSL cert (use shared docker volume?)
export const getPrivateKey = async () => {
  const privateKeyPath = walk(process.env.TLS_DIRECTORY, `${process.env.DOMAIN}.key`);
  if (!privateKeyPath) return null;

  const privateKey = fs.readFileSync(privateKeyPath, 'utf-8')
    .replace(/-----(BEGIN|END) PRIVATE KEY-----\n?/g, '');

  return webcrypto.subtle.importKey(
    'pkcs8',
    Buffer.from(privateKey, 'base64'),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
};
