import { Prisma } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { FormAlertData } from "../../../../components/editor/Editor";
import { withErrorHandler } from "../../../../lib/apiErrorHandler";
import { mapFormAlertDataToCapSchema } from "../../../../lib/cap";
import { REDIS_PREFIX_SIGNED_ALERTS } from "../../../../lib/constants";
import prisma from "../../../../lib/prisma";
import redis from "../../../../lib/redis";
import { CAPV12JSONSchema } from "../../../../lib/types/cap.schema";
import { formatAlertAsXML } from "../../../../lib/xml/helpers";
import { sign } from "../../../../lib/xml/sign";
import { authOptions } from "../../auth/[...nextauth]";

async function handleUpdateAlert(
  req: NextApiRequest,
  res: NextApiResponse,
  alertId: string | string[] | undefined
) {
  if (typeof alertId !== "string") {
    throw new ApiError(400, "You did not provide a valid Alert ID");
  }

  if (!req.body.data) {
    throw new ApiError(400, "You did not provide valid alert details");
  }

  if (!["PUBLISHED", "DRAFT"].includes(req.body.status)) {
    throw new ApiError(400, "You did not provide a valid alert status");
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const alert = await prisma.alert.findFirst({
    where: { id: alertId },
    include: {
      SharedAlerts: {
        include: { User: { select: { email: true } } },
        where: { expires: { gt: new Date() } },
      },
      AlertingAuthority: {
        select: { name: true, author: true },
      },
    },
  });

  if (!alert) {
    throw new ApiError(
      404,
      "You did not provide a valid alert ID, or you do not have permission to edit this alert"
    );
  }

  const alertingAuthority =
    session.user.alertingAuthorities[alert.alertingAuthorityId];

  const isShared = !!alert.SharedAlerts.find(
    (s) => s.User.email === session.user.email
  );

  // User must be part of AA or the alert must have been shared with them
  if (!alertingAuthority) {
    if (!isShared) {
      throw new ApiError(
        403,
        "You do not have permission to edit alerts for this Alerting Authority"
      );
    }

    // i.e., only draft alerts can be updated by shared users
    if (alert.status !== "DRAFT") {
      throw new ApiError(
        410,
        "This alert is no longer a draft, therefore your shared access has expired."
      );
    }
  }

  const roles = isShared ? ["COMPOSER"] : alertingAuthority.roles;

  // i.e., only admins and approvers can publish an existing alert
  if (
    req.body.status === "PUBLISHED" &&
    !roles.includes("ADMIN") &&
    !roles.includes("APPROVER")
  ) {
    throw new ApiError(403, "You do not have permission to publish alerts");
  }

  // i.e., nobody can edit an already-published alert
  if (alert.status === "PUBLISHED") {
    throw new ApiError(
      403,
      "You cannot edit an alert that has already been published"
    );
  }

  const alertData: FormAlertData = req.body.data;

  try {
    const newAlert: CAPV12JSONSchema = mapFormAlertDataToCapSchema(
      alert.AlertingAuthority,
      alertData,
      alertId
    );
    await prisma.alert.update({
      where: { id: alert.id },
      data: {
        data: newAlert as Prisma.InputJsonValue,
        status: req.body.status,
      },
    });

    return res.status(200).json({ error: false });
  } catch (err) {
    console.error(err);
    throw new ApiError(400, "You did not provide valid alert details");
  }
}

async function handleGetAlert(
  req: NextApiRequest,
  res: NextApiResponse,
  alertId: string | string[] | undefined
) {
  if (typeof alertId !== "string") {
    return res.redirect("/feed");
  }

  try {
    const alert = await prisma.alert.findFirst({ where: { id: alertId } });
    if (!alert) return res.status(404).send("Alert does not exist");

    // Don't sign alerts that haven't been published or have expired
    if (
      alert.status !== "PUBLISHED" ||
      new Date(alert.data!.info?.[0]?.expires) < new Date()
    ) {
      res.setHeader("Content-Type", "application/xml");
      return res
        .status(200)
        .send(formatAlertAsXML(alert.data as CAPV12JSONSchema));
    }

    const redisKey = `${REDIS_PREFIX_SIGNED_ALERTS}:${alert.id}`;
    let signedXML: string | null | undefined = await redis.HGET(
      redisKey,
      "signed_xml"
    );

    if (!signedXML) {
      signedXML = await sign(alert);
      if (!signedXML) return res.status(500).send("Failed to sign alert");

      // Cache, and expire every 20 days
      await redis.HSET(redisKey, [
        "signed_xml",
        signedXML,
        "last_signed_at",
        new Date().getTime(),
      ]);
      await redis.expire(redisKey, 60 * 60 * 24 * 20);
    }

    res.setHeader("Content-Type", "application/xml");
    return res.status(200).send(signedXML);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Failed to sign alert");
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertId } = req.query;

  if (req.method === "PUT") {
    return handleUpdateAlert(req, res, alertId);
  }

  if (req.method === "GET") {
    return handleGetAlert(req, res, alertId);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
