import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { unstable_getServerSession } from "next-auth";

import prisma from '../../../lib/prisma';
import { authOptions } from "../auth/[...nextauth]";

/**
 * To register with WebAuthn, you need to be logged in already (via magic link).
 * Then, on future logins, you can use WebAuthn.
 */

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session?.user) {
    return res.status(403).json({ error: true, message: 'You are not logged in' });
  }

  if (req.method === "GET") {
    const authenticators = await prisma.authenticator.findMany({
      where: { user: { email: session.user.email as string } },
      select: { credentialID: true, credentialDeviceType: true, transports: true }
    });

    const userWebauthnId = randomBytes(32).toString('hex');
    const options = generateRegistrationOptions({
      rpID: process.env.WEBAUTHN_RELAYING_PARTY_ID,
      rpName: process.env.WEBAUTHN_RELAYING_PARTY_NAME,
      userID: userWebauthnId,
      userName: session.user.name as string,
      attestationType: 'none',
      authenticatorSelection: { userVerification: 'preferred', residentKey: 'required' },
      excludeCredentials: authenticators.map(a => ({ id: Buffer.from(a.credentialID, 'base64url'), type: a.credentialDeviceType, transports: a.transports })),
    });

    await prisma.user.update({
      where: { email: session.user.email as string },
      data: { currentWebauthnChallenge: options.challenge, webauthnId: userWebauthnId }
    });

    return res.json(options);
  }

  if (req.method === 'POST') {
    const credential = req.body;

    const challenge = await prisma.user.findFirst({
      where: { email: session.user.email as string },
      select: { currentWebauthnChallenge: true }
    });

    if (!challenge?.currentWebauthnChallenge) {
      return res.status(401).json({ error: true, message: 'Cannot register yet' });
    }

    const { verified, registrationInfo } = await verifyRegistrationResponse({
      credential,
      expectedRPID: process.env.WEBAUTHN_RELAYING_PARTY_ID,
      expectedOrigin: process.env.WEBAUTHN_ORIGIN,
      expectedChallenge: challenge.currentWebauthnChallenge,
      requireUserVerification: true,
    });

    if (verified && registrationInfo) {
      await prisma.user.update({
        where: { email: session.user.email as string },
        data: {
          authenticators: {
            create: {
              counter: registrationInfo.counter,
              credentialPublicKey: registrationInfo.credentialPublicKey,
              credentialID: registrationInfo.credentialID.toString('base64url'),
              credentialBackedUp: registrationInfo.credentialBackedUp,
              transports: credential.transports?.length ? credential.transports : ['internal'],
              credentialDeviceType: registrationInfo.credentialDeviceType,
            }
          },
          currentWebauthnChallenge: null
        }
      });

      return res.json({ error: false });
    }

    await prisma.user.update({
      where: { email: session.user.email as string },
      data: { currentWebauthnChallenge: null }
    });
    return res.status(500).json({ error: true, message: 'Unable to register' });

  }
}
