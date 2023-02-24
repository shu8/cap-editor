import { generateAuthenticationOptions } from "@simplewebauthn/server";
import { setCookie } from "cookies-next";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";

import { withErrorHandler } from "../../../../lib/apiErrorHandler";
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

  // Expire after 5 minutes
  await redis.HSET(
    `webauthn-auth:${tempUserId}`,
    "challenge",
    options.challenge
  );
  await redis.expire(`webauthn-auth:${tempUserId}`, 60 * 5);

  return res.json(options);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return getUserAuthenticationOptions(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
