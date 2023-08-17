import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../../../lib/apiErrorHandler";
import prisma from "../../../../../lib/prisma";
import { authOptions } from "../../../auth/[...nextauth]";

async function handleExportAlerts(
  alertingAuthorityId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  if (
    !req.body.status?.length ||
    req.body.status.find((s: string) => !["PUBLISHED", "DRAFT"].includes(s))
  ) {
    throw new ApiError(400, "You did not provide a valid alert status");
  }

  if (req.body.sent?.length != 2) {
    throw new ApiError(400, "You did not provide any date range filter");
  }

  if (!req.body.language?.length) {
    throw new ApiError(400, "You did not provide any languages filter");
  }

  if (!session.user.alertingAuthorities[alertingAuthorityId]) {
    throw new ApiError(
      400,
      "You did not provide a valid Alerting Authority to export alerts from, or you do not have permission to export alerts for this Alerting Authority"
    );
  }

  const alerts = await prisma.alert.findMany({
    where: {
      status: { in: req.body.status },
      language: { in: req.body.language },
      data: {
        path: ["sent"],
        gte: req.body.sent[0],
        lte: req.body.sent[1],
      },
    },
    select: {
      alertingAuthorityId: true,
      id: true,
      language: true,
      status: true,
      data: true,
    },
  });

  return res.status(200).json(alerts);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertingAuthorityId } = req.query;

  if (typeof alertingAuthorityId !== "string") {
    throw new ApiError(
      400,
      "You did not provide a valid Alerting Authority ID"
    );
  }

  if (req.method === "POST") {
    return handleExportAlerts(alertingAuthorityId, req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
