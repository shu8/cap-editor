import type { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../lib/prisma";
import { formatAlertingAuthoritiesAsXML } from "../../../lib/xml/helpers";
import { withErrorHandler } from "../../../lib/apiErrorHandler";

async function handleGetAlertingAuthorityFeeds(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // /feed simply returns list of all AAs and their feed URLs
  const alertingAuthorities = await prisma.alertingAuthority.findMany();
  res.setHeader("Content-Type", "application/xml");
  return res
    .status(200)
    .send(await formatAlertingAuthoritiesAsXML(alertingAuthorities));
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetAlertingAuthorityFeeds(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
