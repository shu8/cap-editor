import { webcrypto } from 'node:crypto';

// TODO get the keys from the SSL cert (use shared docker volume?)
export const getKeys = async () => {
  return webcrypto.subtle.generateKey(
    {
      name: "ECDSA",
      namedCurve: "P-256",
    },
    false,
    ["sign", "verify"]
  )
    .catch(function (err) {
      console.error(err);
    });
}
