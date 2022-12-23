import type { NextApiRequest, NextApiResponse } from "next";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";
import { AlertingAuthority } from "../../lib/types/types";

// TODO: WMO returns some AAs with same GUIDs -- how to handle?
// TODO: cache AA information from WMO
export default async function handler(
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
