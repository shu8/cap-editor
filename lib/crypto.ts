import fs from 'fs';
import { webcrypto } from 'node:crypto';

// ssh-keygen -m PKCS8 -t ecdsa
// TODO get the keys from the SSL cert (use shared docker volume?)
export const getPrivateKey = async () => {
  const privateKey = fs.readFileSync('./private-key.pem', 'utf-8')
    .replace(/-----(BEGIN|END) PRIVATE KEY-----\n?/g, '');

  return webcrypto.subtle.importKey(
    'pkcs8',
    Buffer.from(privateKey, 'base64'),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
};
