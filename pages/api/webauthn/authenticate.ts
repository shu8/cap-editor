import type { NextApiRequest, NextApiResponse } from "next";
import { setCookie } from "cookies-next";
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { randomUUID } from "crypto";
import redis from "../../../lib/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
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
}
