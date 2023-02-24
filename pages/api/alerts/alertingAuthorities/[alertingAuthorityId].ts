import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { FormAlertData } from "../../../../components/editor/Editor";
import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import { mapFormAlertDataToCapSchema } from "../../../../lib/cap";
import prisma from "../../../../lib/prisma";
import { CAPV12JSONSchema } from "../../../../lib/types/cap.schema";
import { formatAlertingAuthorityFeedAsXML } from "../../../../lib/xml/helpers";
import { authOptions } from "../../auth/[...nextauth]";

async function handleNewAlert(
  alertingAuthorityId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  if (!["TEMPLATE", "PUBLISHED", "DRAFT"].includes(req.body.status)) {
    throw new ApiError(400, "You did not provide a valid alert status");
  }

  const alertingAuthority = await prisma.userAlertingAuthorities.findFirst({
    where: {
      alertingAuthorityId,
      alertingAuthorityVerified: { not: null },
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

  // i.e., if they are only a VALIDATOR, then they can only publish existing drafted alerts (not POST new ones)
  if (!roles.includes("ADMIN") && !roles.includes("EDITOR")) {
    throw new ApiError(403, "You do not have permission to create new alerts");
  }

  // i.e., only admins can request to publish a new alert (a validator must update the status of an existing alert and an editor can only edit drafts/templates)
  if (!roles.includes("ADMIN") && req.body.status === "PUBLISHED") {
    throw new ApiError(403, "You do not have permission to publish new alerts");
  }

  const identifier = randomUUID();
  const alertData: FormAlertData = req.body.data;

  try {
    const alert: CAPV12JSONSchema = mapFormAlertDataToCapSchema(
      alertingAuthority.AlertingAuthority,
      alertData,
      identifier
    );
    await prisma.alert.create({
      data: {
        id: alert.identifier,
        data: alert as Prisma.InputJsonValue,
        creator: { connect: { email: session.user.email } },
        status: req.body.status,
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
  const { json } = req.query;

  // JSON returns all alerts, unsigned, inc. draft and template, as long as you are logged in
  if (json) {
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
    });
    return res.json({ error: false, alerts });
  }

  const alertingAuthorityAlerts = await prisma.alertingAuthority.findFirst({
    where: { id: alertingAuthorityId },
    include: { Alerts: { where: { status: "PUBLISHED" } } },
  });

  if (!alertingAuthorityAlerts) {
    return res.status(404).send("Alerting Authority not found");
  }

  // Standard XML feed contains only active published alerts that haven't expired
  res.setHeader("Content-Type", "application/xml");
  return res.status(200).send(
    await formatAlertingAuthorityFeedAsXML(
      {
        name: alertingAuthorityAlerts.name,
        id: alertingAuthorityAlerts.id,
        // TODO should this be a generic AA email rather than the author's email? where to get it from?
        author: alertingAuthorityAlerts.author,
      },
      alertingAuthorityAlerts.Alerts.filter(
        (a) => new Date(a.data!.info?.[0]?.expires) >= new Date()
      )
    )
  );
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
    return handleNewAlert(alertingAuthorityId, req, res);
  }

  if (req.method === "GET") {
    return handleGetAlerts(alertingAuthorityId, req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
