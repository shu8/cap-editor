import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../lib/apiErrorHandler";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

async function handleGetSharedAlerts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(403, "You are not logged in");

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: {
      SharedAlerts: {
        include: { Alert: true },
        where: { expires: { gt: new Date() } },
      },
    },
  });

  return res.json({
    error: false,
    alerts: user?.SharedAlerts.map((a) => a.Alert) ?? [],
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetSharedAlerts(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
