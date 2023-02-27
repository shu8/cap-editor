import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import { randomBytes } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { Session, getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import { REDIS_PREFIX_WEBAUTHN_REGISTER_CHALLENGE } from "../../../../lib/constants";
import prisma from "../../../../lib/prisma";
import redis from "../../../../lib/redis";
import { authOptions } from "../[...nextauth]";

/**
 * To register with WebAuthn, you need to be logged in already (via magic link).
 * Then, on future logins, you can use WebAuthn.
 */
async function handleGetUserRegistrationOptions(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  const authenticators = await prisma.authenticator.findMany({
    where: { User: { email: session.user.email as string } },
    select: {
      credentialID: true,
      credentialDeviceType: true,
      transports: true,
    },
  });

  const userWebauthnId = randomBytes(32).toString("hex");
  const options = generateRegistrationOptions({
    rpID: process.env.WEBAUTHN_RELYING_PARTY_ID,
    rpName: process.env.WEBAUTHN_RELYING_PARTY_NAME,
    userID: userWebauthnId,
    userName: session.user.name as string,
    attestationType: "none",
    authenticatorSelection: {
      userVerification: "preferred",
      residentKey: "required",
    },
    excludeCredentials: authenticators.map((a) => ({
      id: Buffer.from(a.credentialID, "base64url"),
      type: a.credentialDeviceType,
      transports: a.transports,
    })),
  });

  await prisma.user.update({
    where: { email: session.user.email as string },
    data: { webauthnId: userWebauthnId },
  });

  // Expire challenge after 5 minutes
  const redisKey = `${REDIS_PREFIX_WEBAUTHN_REGISTER_CHALLENGE}:${session.user.email}`;
  await redis.HSET(redisKey, "challenge", options.challenge);
  await redis.expire(redisKey, 60 * 5);

  return res.json(options);
}

async function handleUserRegistration(
  req: NextApiRequest,
  res: NextApiResponse,
  session: Session
) {
  const credential = req.body;

  const redisKey = `${REDIS_PREFIX_WEBAUTHN_REGISTER_CHALLENGE}:${session.user.email}`;
  const challenge = await redis.HGET(redisKey, "challenge");
  if (!challenge) {
    throw new ApiError(403, "Your account cannot register for WebAuthn yet");
  }
  await redis.del(redisKey);

  const { verified, registrationInfo } = await verifyRegistrationResponse({
    credential,
    expectedRPID: process.env.WEBAUTHN_RELYING_PARTY_ID,
    expectedOrigin: process.env.WEBAUTHN_ORIGIN,
    expectedChallenge: challenge,
    requireUserVerification: true,
  });

  if (verified && registrationInfo) {
    await prisma.user.update({
      where: { email: session.user.email as string },
      data: {
        Authenticators: {
          create: {
            counter: registrationInfo.counter,
            credentialPublicKey: registrationInfo.credentialPublicKey,
            credentialID: registrationInfo.credentialID.toString("base64url"),
            credentialBackedUp: registrationInfo.credentialBackedUp,
            transports: credential.transports?.length
              ? credential.transports
              : ["internal"],
            credentialDeviceType: registrationInfo.credentialDeviceType,
          },
        },
      },
    });

    return res.json({ error: false });
  }

  throw new Error("Unable to register");
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) throw new ApiError(401, "You are not logged in");

  if (req.method === "GET") {
    return handleGetUserRegistrationOptions(req, res, session);
  }

  if (req.method === "POST") {
    return handleUserRegistration(req, res, session);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
