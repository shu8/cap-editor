import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../../../lib/apiErrorHandler";
import { mapFormAlertDataToCapSchema } from "../../../../../lib/cap";
import prisma from "../../../../../lib/prisma";
import { CAPV12JSONSchema } from "../../../../../lib/types/cap.schema";
import { authOptions } from "../../../auth/[...nextauth]";
import { formatAlertAsXML } from "../../../../../lib/xml/helpers";
import { ValidatorResult } from "jsonschema";
import { generateAlertIdentifier } from "../../../../../lib/helpers.server";

async function handlePreviewAlert(
  alertingAuthorityId: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  if (!req.body) {
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

  const sent = new Date();
  const identifier = generateAlertIdentifier(
    alertingAuthority.alertingAuthorityId,
    sent
  );
  try {
    const alertData: CAPV12JSONSchema = mapFormAlertDataToCapSchema(
      alertingAuthority.AlertingAuthority,
      req.body,
      sent,
      identifier
    );
    return res
      .status(200)
      .json({ error: false, xml: formatAlertAsXML(alertData) });
  } catch (err) {
    if (err instanceof ValidatorResult) {
      const errors = err.errors.map(
        (e) => `${e.property.split(".").at(-1)} ${e.message}`
      );
      return res.status(400).json({ error: true, messages: errors });
    }

    throw new ApiError(400, "You did not provide valid alert details");
  }
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
    return handlePreviewAlert(alertingAuthorityId, req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
