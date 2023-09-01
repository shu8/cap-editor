import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import { withErrorHandler } from "../../../../../../lib/apiErrorHandler";
import prisma from "../../../../../../lib/prisma";
import { formatAlertingAuthorityFeedAsXML } from "../../../../../../lib/xml/helpers";

async function handleGetAlerts(
  alertingAuthorityId: string,
  language: string,
  req: NextApiRequest,
  res: NextApiResponse
) {
  const alertingAuthorityAlerts = await prisma.alertingAuthority.findFirst({
    where: { id: alertingAuthorityId },
    include: { Alerts: { where: { status: "PUBLISHED", language } } },
  });

  if (!alertingAuthorityAlerts) {
    return res.status(404).send("Alerting Authority not found");
  }

  // Standard XML feed contains only active published alerts that haven't expired
  res.setHeader("Content-Type", "application/xml");
  return res.status(200).send(
    await formatAlertingAuthorityFeedAsXML(
      { name: alertingAuthorityAlerts.name, id: alertingAuthorityAlerts.id },
      language,
      alertingAuthorityAlerts.Alerts.filter(
        (a) => new Date(a.data!.info?.[0]?.expires) >= new Date()
      )
    )
  );
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { alertingAuthorityId, language } = req.query;

  if (typeof alertingAuthorityId !== "string") {
    throw new ApiError(
      400,
      "You did not provide a valid Alerting Authority ID"
    );
  }

  if (typeof language !== "string") {
    throw new ApiError(400, "You did not provide a valid language");
  }

  if (req.method === "GET") {
    return handleGetAlerts(alertingAuthorityId, language, req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
