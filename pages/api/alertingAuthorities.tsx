import type { NextApiRequest, NextApiResponse } from "next";

import { withErrorHandler } from "../../lib/apiErrorHandler";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";

async function handleGetAlertingAuthorities(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await fetchWMOAlertingAuthorities();
  return res.json({ result: data });
}

// TODO: WMO returns some AAs with same GUIDs -- how to handle?
// TODO: cache AA information from WMO
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetAlertingAuthorities(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
