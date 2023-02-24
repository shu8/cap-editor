import type { NextApiRequest, NextApiResponse } from "next";

import { withErrorHandler } from "../../lib/apiErrorHandler";
import { fetchWMOAlertingAuthorities } from "../../lib/helpers.server";

async function handleGetAlertingAuthorities(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = await fetchWMOAlertingAuthorities();
  return res.json({ result: data });
}

// Note: as of 2023-02-24, the WMO Register of AAs returns 2 AA records with the same GUID:
//  urn:oid:2.49.0.0.626.0 and urn:oid:2.49.0.0.768.0. These seem to be referring to the same
//  AA based on their country code, email and name.
// We handle this by taking the first record in the list for a given ID.
// The best solution would be to fix this in the Register itself.
async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetAlertingAuthorities(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
