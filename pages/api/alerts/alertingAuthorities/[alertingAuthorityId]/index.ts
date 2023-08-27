import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { FormAlertData } from "../../../../../components/editor/EditorSinglePage";
import { withErrorHandler } from "../../../../../lib/apiErrorHandler";
import { mapFormAlertDataToCapSchema } from "../../../../../lib/cap";
import prisma from "../../../../../lib/prisma";
import { CAPV12JSONSchema } from "../../../../../lib/types/cap.schema";
import { authOptions } from "../../../auth/[...nextauth]";
import { generateAlertIdentifier } from "../../../../../lib/helpers.server";

async function handleNewAlert(
  alertingAuthorityId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  if (!["PUBLISHED", "DRAFT"].includes(req.body.status)) {
    throw new ApiError(400, "You did not provide a valid alert status");
  }

  if (!req.body.data) {
    throw new ApiError(400, "You did not provide valid alert data");
  }

  const alertingAuthority = await prisma.userAlertingAuthorities.findFirst({
    where: {
      alertingAuthorityId,
      verified: { not: null },
      User: { email: session.user.email },
    },
    include: { AlertingAuthority: { select: { name: true, author: true } } },
  });

  if (!alertingAuthority) {
    throw new ApiError(
      400,
      "You did not provide a valid Alerting Authority to publish this alert under, or you do not have permission to create alerts for this Alerting Authority"
    );
  }

  const roles = alertingAuthority.roles;

  // i.e., only ADMINs and APPROVERs can request to publish a new alert (an EDITOR can only edit drafts)
  if (
    !roles.includes("ADMIN") &&
    !roles.includes("APPROVER") &&
    req.body.status === "PUBLISHED"
  ) {
    throw new ApiError(403, "You do not have permission to publish new alerts");
  }

  const sent = new Date();
  const identifier = generateAlertIdentifier(
    alertingAuthority.alertingAuthorityId,
    sent
  );
  const alertData: FormAlertData = req.body.data;

  // Create a new multi-language group ID for the alert if not linking to an existing one
  const multiLanguageGroupId = req.body.multiLanguageGroupId ?? randomUUID();

  try {
    const alert: CAPV12JSONSchema = mapFormAlertDataToCapSchema(
      alertingAuthority.AlertingAuthority,
      alertData,
      sent,
      identifier,
      multiLanguageGroupId
    );
    await prisma.alert.create({
      data: {
        // The DB alert ID is a UUID, but the actual alert's XML identifier is a "AA ID.SENT DATETIME"
        // These are different because we could create alerts as drafts and publish later, so the
        //  original creation time != final sent time, so ID would need to change
        id: randomUUID(),
        data: alert as Prisma.InputJsonValue,
        creator: { connect: { email: session.user.email } },
        status: req.body.status,
        language: alertData.language,
        AlertingAuthority: {
          connect: { id: alertingAuthority.alertingAuthorityId },
        },
      },
    });
    return res.status(200).json({ error: false, identifier });
  } catch (err) {
    console.error(err);
    throw new ApiError(400, "You did not provide valid alert details");
  }
}

async function handleGetAlerts(
  alertingAuthorityId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  // JSON-only endpoint returns all alerts/languages, unsigned, inc. draft, as long as you are logged in
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(403, "You are not logged in");

  if (!session.user.alertingAuthorities[alertingAuthorityId]) {
    throw new ApiError(
      401,
      "You do not have permission to view JSON alerts for this Alerting Authority"
    );
  }

  const alerts = await prisma.alert.findMany({
    where: { alertingAuthorityId },
    select: {
      alertingAuthorityId: true,
      data: true,
      id: true,
      language: true,
      status: true,
    },
  });
  return res.json({ error: false, alerts });
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
    return handleGetAlerts(alertingAuthorityId, req, res);
  }

  if (req.method === "POST") {
    return handleNewAlert(alertingAuthorityId, req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
