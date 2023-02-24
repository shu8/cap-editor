import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../lib/apiErrorHandler";
import { REDIS_KEY_PENDING_SESSION_UPDATES } from "../../../lib/constants";
import prisma from "../../../lib/prisma";
import redis from "../../../lib/redis";
import { authOptions } from "../auth/[...nextauth]";

async function handleUpdatePersonalDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "You did not provide valid personal details");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  await redis.SADD(REDIS_KEY_PENDING_SESSION_UPDATES, session.user.email);
  return res.json({ error: false });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleUpdatePersonalDetails(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
