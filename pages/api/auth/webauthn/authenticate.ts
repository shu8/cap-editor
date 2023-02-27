import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { setCookie } from "cookies-next";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import { REDIS_PREFIX_WEBAUTHN_AUTH_CHALLENGE } from "../../../../lib/constants";
import redis from "../../../../lib/redis";

async function getUserAuthenticationOptions(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tempUserId = randomUUID();
  const cookieExpiry = new Date();
  cookieExpiry.setMinutes(cookieExpiry.getMinutes() + 5);

  setCookie("webauthn-user-id", tempUserId, {
    req,
    res,
    expires: cookieExpiry,
    maxAge: 60 * 5,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  const options = generateAuthenticationOptions({
    userVerification: "preferred",
  });

  if (options?.challenge) {
    // Expire after 5 minutes
    const redisKey = `${REDIS_PREFIX_WEBAUTHN_AUTH_CHALLENGE}:${tempUserId}`;
    await redis.HSET(redisKey, "challenge", options.challenge);
    await redis.expire(redisKey, 60 * 5);

    return res.json(options);
  }

  return res.status(500).end();
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getUserAuthenticationOptions(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
