import { AlertingAuthority } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";

// TODO: WMO returns some AAs with same GUIDs -- how to handle?
// TODO: cache AA information from WMO
async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { result: AlertingAuthority[] } | { error: boolean; message: string }
  >
) {
  if (req.method === "GET") {
    const data = await fetchWMOAlertingAuthorities();
    return res.json({ result: data });
  }
}

export default withErrorHandler(handler);
