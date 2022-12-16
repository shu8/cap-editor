import { webcrypto } from 'node:crypto';
import { randomUUID } from "crypto";

import fastify from "fastify";
import dotenv from 'dotenv';
import fastifyMongoDb from 'fastify-mongodb';
import xmldsigjs from 'xmldsigjs';

import { formatAlertAsXML, formatFeedAsXML } from "./xmlHelpers.js";
import { getPrivateKey, getPublicKey } from "./crypto.js";

xmldsigjs.Application.setEngine("OpenSSL", webcrypto);

dotenv.config();
const app = fastify({ logger: true });

app.register(fastifyMongoDb, {
  forceClose: true,
  url: process.env.DATABASE_URL,
});

app.post('/alerts', async (request, reply) => {
  const { sender, sent = new Date().toISOString(), status, msgType, scope, info } = request.body;
  const { category, event, urgency, severity, certainty, resourceDesc, areaDesc } = info;

  const id = randomUUID();
  const alert = await app.mongo.db.collection('alerts').insertOne({
    id,
    sender, sent, status, msgType, scope,
    info: {
      category, event, urgency, severity, certainty, resourceDesc, areaDesc
    }
  });

  return { success: true, id };
});

app.get('/alerts', async (request, reply) => {
  reply.redirect('/feed');
});

app.get('/alerts/:id', async (request, reply) => {
  const alert = await app.mongo.db.collection('alerts').findOne({ id: request.params.id });
  const alertXml = xmldsigjs.Parse(formatAlertAsXML(alert));
  const signed = new xmldsigjs.SignedXml(alertXml);
  const privateKey = await getPrivateKey();

  const signature = await signed.Sign(
    { name: "ECDSA", hash: 'SHA-512' },
    privateKey,
    alertXml,
    {
      references: [{ hash: "SHA-512", transforms: ["enveloped", "c14n"] }]
    })
    .catch(e => console.log(e));

  signature.LoadXml(signed.XmlSignature.GetXml());
  reply
    .code(200)
    .header('Content-Type', 'application/xml')
    .send(signed.toString());
})

app.get('/alerts/verify/:id', async (request, reply) => {
  const alert = await app.mongo.db.collection('alerts').findOne({ id: request.params.id });
  const alertXml = xmldsigjs.Parse(formatAlertAsXML(alert));
  const signed = new xmldsigjs.SignedXml(alertXml);
  const publicKey = await getPublicKey();

  const isValid = await signed.Verify(publicKey)
    .catch(e => console.log(e));

  return { valid: isValid }
});

app.get('/feed', async (request, reply) => {
  const alertsCursor = await app.mongo.db.collection('alerts').find();
  const alerts = await alertsCursor.toArray();

  reply
    .code(200)
    .header('Content-Type', 'application/xml')
    .send(formatFeedAsXML(alerts));
})

app.listen({ port: 3000 }).catch(err => {
  app.log.error(err);
  process.exit(1);
})
