import type { NextApiRequest, NextApiResponse } from "next";

import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import prisma from "../../../../lib/prisma";
import { ApiError } from "next/dist/server/api-utils";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

type UpdateData = {
  contact?: string;
  web?: string;
  defaultTimezone?: string;
  severityCertaintyMatrixEnabled?: boolean;
};

async function handleUpdateAlertingAuthority(
  req: NextApiRequest,
  res: NextApiResponse,
  alertingAuthorityId: string
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const alertingAuthority =
    session.user.alertingAuthorities[alertingAuthorityId];

  if (!alertingAuthority) {
    throw new ApiError(404, "You did not choose a valid Alerting Authority");
  }

  if (!alertingAuthority.roles.includes("ADMIN")) {
    throw new ApiError(
      403,
      "You do not have permission to edit this Alerting Authority"
    );
  }

  const data: UpdateData = {};
  [
    "contact",
    "web",
    "defaultTimezone",
    "severityCertaintyMatrixEnabled",
  ].forEach((prop) => {
    if (req.body[prop]) data[prop as keyof UpdateData] = req.body[prop];
  });

  await prisma.alertingAuthority.update({
    where: { id: alertingAuthorityId },
    data,
  });

  return res.json({ error: false });
}

async function handleGetAlertingAuthority(
  req: NextApiRequest,
  res: NextApiResponse,
  alertingAuthorityId: string
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const alertingAuthority = await prisma.alertingAuthority.findFirst({
    where: { id: alertingAuthorityId },
    select: {
      id: true,
      countryCode: true,
      name: true,
      defaultTimezone: true,
      contact: true,
      web: true,
      severityCertaintyMatrixEnabled: true,
    },
  });

  if (!alertingAuthority) {
    throw new ApiError(404, "You did not choose a valid Alerting Authority");
  }

  return res.json(alertingAuthority);
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertingAuthorityId } = req.query;

  if (typeof alertingAuthorityId !== "string") {
    throw new ApiError(
      400,
      "You did not provide a valid Alerting Authority ID"
    );
  }

  if (req.method === "GET") {
    return handleGetAlertingAuthority(req, res, alertingAuthorityId);
  }

  if (req.method === "POST") {
    return handleUpdateAlertingAuthority(req, res, alertingAuthorityId);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
