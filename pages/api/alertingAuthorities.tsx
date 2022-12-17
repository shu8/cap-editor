import type { NextApiRequest, NextApiResponse } from "next";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";
import { AlertingAuthority } from "../../lib/types";

// TODO: WMO returns some AAs with same GUIDs -- how to handle?
// TODO: cache AA information from WMO
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ result: AlertingAuthority[] }>
) {
  if (req.method === "GET") {
    const data = await fetchWMOAlertingAuthorities();
    return res.json({ result: data });
  }
}
