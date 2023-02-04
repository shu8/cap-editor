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

async function handleNewAlert(req: NextApiRequest, res: NextApiResponse) {
  if (!["TEMPLATE", "PUBLISHED", "DRAFT"].includes(req.body.status)) {
    throw new ApiError(400, "You did not provide a valid alert status");
  }

  if (!req.body.alertingAuthorityId) {
    throw new ApiError(
      400,
      "You did not specify which Alerting Authority to publish this alert under"
    );
  }

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const alertingAuthority = await prisma.userAlertingAuthorities.findFirst({
    where: {
      alertingAuthorityId: req.body.alertingAuthorityId,
      alertingAuthorityVerified: { not: null },
      user: { email: session.user.email },
    },
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
      alertData,
      identifier
    );
    await prisma.alert.create({
      data: {
        id: alert.identifier,
        data: alert as Prisma.InputJsonValue,
        creator: { connect: { email: session.user.email } },
        status: req.body.status,
        alertingAuthority: {
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

async function handleGetAlerts(req: NextApiRequest, res: NextApiResponse) {
  const { alerting_authority: alertingAuthorityId, json } = req.query;

  // JSON returns all alerts, unsigned, inc. draft and template, as long as you are logged in
  if (json) {
    if (typeof alertingAuthorityId !== "string" || !alertingAuthorityId) {
      throw new ApiError(400, "You did not provide a valid Alerting Authority");
    }

    const session = await unstable_getServerSession(req, res, authOptions);
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

  const alerts = await prisma.alert.findMany();

  // TODO: how should we handle multiple alerting authorities for the fede?
  // Standard XML feed contains only active published alerts that haven't expired
  res.setHeader("Content-Type", "application/xml");
  return res
    .status(200)
    .send(
      await formatFeedAsXML(
        alerts.filter(
          (a) =>
            a.status === "PUBLISHED" &&
            new Date(a.data?.info?.[0]?.expires) >= new Date()
        )
      )
    );
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleNewAlert(req, res);
  }

  if (req.method === "GET") {
    return handleGetAlerts(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
