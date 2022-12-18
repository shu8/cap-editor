const https = require('https');
const { webcrypto } = require('node:crypto');
const { createInterface } = require('readline/promises');
const xmldsigjs = require('xmldsigjs');

const readline = createInterface({ input: process.stdin, output: process.stdout });
xmldsigjs.Application.setEngine("OpenSSL", webcrypto);

const askQuestion = async (q) => {
  const answer = await readline.question(q + ' ');
  readline.close();
  return answer;
};

const printError = text => console.error(`\u001b[1;31m${text}\u001b[0m`);

const extractPublicKey = async (key) => {
  const publicKey = key.export({ type: 'spki', format: 'der' });
  return await webcrypto.subtle.importKey(
    'spki',
    Buffer.from(publicKey),
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['verify']
  );
};

// Get the XML and the TLS certificate for the URL
// We expect Alerts to be signed by the private key of the TLS certificate
// So we can verify authenticity by checking the public key of the certificate against the XML Signature

// TODO but do we want the URL of the alert, or extract the URL specified within the alert?
const fetchAlertAndCert = async url => {
  return new Promise((resolve, reject) => {
    const req = https.get(url);
    req.once('response', (res) => {
      const certificate = req.socket.getPeerX509Certificate();
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ certificate, body }));
    });
    req.once('error', (err) => reject(err));
  });
};

const start = async () => {
  const alertUrl = await askQuestion('What is the CAP Alert URL?');
  console.info(`\u001b[1;34mChecking ${alertUrl}...\u001b[0m`);

  if (!alertUrl.startsWith('https://')) {
    return printError('Please enter a valid Alert URL (it should begin with "https://")');
  }

  try {
    const { body, certificate } = await fetchAlertAndCert(alertUrl);

    const now = new Date();
    if (
      (new Date(certificate.validFrom) > now)
      || (new Date(certificate.vaildTo) < now)
    ) {
      return printError('INVALID: TLS certificate expired');
    }

    const parsedXml = xmldsigjs.Parse(body);
    const signature = parsedXml.getElementsByTagNameNS("http://www.w3.org/2000/09/xmldsig#", "Signature");
    const signedXml = new xmldsigjs.SignedXml(parsedXml);
    signedXml.LoadXml(signature[0]);

    const publicKey = extractPublicKey(certificate.publicKey);
    const isValid = await signedXml.Verify(publicKey);

    if (!isValid) {
      return printError('INVALID: signature does not match TLS public key');
    }

    // TODO check CRL
  } catch (err) {
    return printError(`INVALID: failed to inspect alert.\n\n${err.message}`);
  }

  console.log('\u001b[1;32mVALID: alert is signed and valid\u001b[0m');
};

start();
