import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import prisma from "../../lib/prisma";
import { withErrorHandler } from "../../lib/apiErrorHandler";

async function handleRegisterUser(req: NextApiRequest, res: NextApiResponse) {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new ApiError(400, "You did not provide your valid details");
  }

  await prisma.user.create({ data: { name, email } });
  return res.json({ error: false });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleRegisterUser(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
