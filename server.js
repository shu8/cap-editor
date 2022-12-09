import { randomUUID } from "crypto";
import fastify from "fastify";
import dotenv from 'dotenv';
import fastifyMongoDb, { ObjectId } from 'fastify-mongodb';
import { formatAlertAsXML, formatFeedAsXML } from "./xmlHelpers.js";

dotenv.config();
const app = fastify({ logger: true });

app.register(fastifyMongoDb, {
  forceClose: true,
  url: process.env.DATABASE_URL,
});

app.post('/alerts', async (request, reply) => {
  const { sender, sent = new Date().toISOString(), status, msgType, scope, info } = request.body;
  const { category, event, urgency, severity, certainty, resourceDesc, areaDesc } = info;

  await app.mongo.db.collection('alerts').insertOne({
    id: randomUUID(),
    sender, sent, status, msgType, scope,
    info: {
      category, event, urgency, severity, certainty, resourceDesc, areaDesc
    }
  });
});

app.get('/alerts/:id', async (request, reply) => {
  const alert = await app.mongo.db.collection('alerts').findOne({ id: request.params.id });

  reply
    .code(200)
    .header('Content-Type', 'application/xml')
    .send(formatAlertAsXML(alert));
})

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
