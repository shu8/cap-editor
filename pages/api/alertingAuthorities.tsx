import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers";
import { AlertingAuthority } from "../../lib/types";
import { authOptions } from "./auth/[...nextauth]";

// TODO: WMO returns some AAs with same GUIDs -- how to handle?
// TODO: cache AA information from WMO
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    { result: AlertingAuthority[] } | { error: boolean; message: string }
  >
) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (req.method === "GET") {
    if (!session) {
      return res.json({ error: true, message: "You are not logged in." });
    }
    const data = await fetchWMOAlertingAuthorities();
    return res.json({ result: data });
  }
}
