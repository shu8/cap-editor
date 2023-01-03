import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { randomUUID } from "crypto";

import redis from "../../../lib/redis";
import { withErrorHandler } from "../../../lib/apiErrorHandler";

async function getUserAuthenticationOptions(req: NextApiRequest, res: NextApiResponse) {
  const tempUserId = randomUUID();
  const cookieExpiry = new Date();
  cookieExpiry.setMinutes(cookieExpiry.getMinutes() + 5);

  setCookie('webauthn-user-id', tempUserId, {
    req,
    res,
    expires: cookieExpiry,
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  });

  const options = generateAuthenticationOptions({
    userVerification: 'preferred',
  });

  await redis.hSet('webauthn-auth-challenges', tempUserId, options.challenge);
  return res.json(options);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getUserAuthenticationOptions(req, res);
  }

  return res.status(405).send('Method not allowed');
}

export default withErrorHandler(handler);
