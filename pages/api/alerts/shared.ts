import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { randomUUID } from "crypto";
import { ApiError } from "next/dist/server/api-utils";
import { Prisma } from "@prisma/client";

import prisma from "../../../lib/prisma";
import { authOptions } from "../auth/[...nextauth]";
import { formatFeedAsXML } from "../../../lib/xml/helpers";
import { CAPV12JSONSchema } from "../../../lib/types/cap.schema";
import { FormAlertData } from "../../../components/editor/Editor";
import { mapFormAlertDataToCapSchema } from "../../../lib/cap";
import { withErrorHandler } from "../../../lib/apiErrorHandler";

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
