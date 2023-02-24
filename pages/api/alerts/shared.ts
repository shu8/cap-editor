import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../lib/apiErrorHandler";
import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";

async function handleGetSharedAlerts(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(403, "You are not logged in");

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: {
      sharedAlerts: {
        include: { alert: true },
        where: { expires: { gt: new Date() } },
      },
    },
  });

  return res.json({
    error: false,
    alerts: user?.sharedAlerts.map((a) => a.alert),
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetSharedAlerts(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
