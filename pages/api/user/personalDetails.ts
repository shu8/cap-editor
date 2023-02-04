import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";
import { AlertingAuthority } from "@prisma/client";
import { ApiError } from "next/dist/server/api-utils";

import prisma from "../../../lib/prisma";
import { sendEmail } from "../../../lib/email";
import { fetchWMOAlertingAuthorities } from "../../../lib/helpers.server";
import { withErrorHandler } from "../../../lib/apiErrorHandler";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import redis from "../../../lib/redis";

async function handleUpdatePersonalDetails(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const { name } = req.body;
  if (!name) {
    throw new ApiError(400, "You did not provide valid personal details");
  }

  await prisma.user.update({
    where: { email: session.user.email },
    data: { name },
  });

  await redis.SADD("pendingSessionUpdates", session.user.email);
  return res.json({ error: false });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleUpdatePersonalDetails(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
