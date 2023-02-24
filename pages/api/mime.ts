import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import MIMEType from "whatwg-mimetype";

import { withErrorHandler } from "../../lib/apiErrorHandler";
import { authOptions } from "./auth/[...nextauth]";

async function handleGetMimeType(req: NextApiRequest, res: NextApiResponse) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(401, "You are not logged in");

  const { url } = req.query;
  if (typeof url !== "string")
    throw new ApiError(400, "You did not provide a valid URL");

  try {
    const response = await fetch(url);
    if (response.status !== 200)
      throw new ApiError(400, "You did not provide a valid URL");

    const contentType = response.headers.get("Content-Type");
    if (!contentType)
      return res.json({ error: false, mime: "application/octet-stream" });

    const mime = new MIMEType(contentType).essence;
    return res.json({ error: false, mime });
  } catch (err) {
    throw new ApiError(400, "Unable to access resource");
  }
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return handleGetMimeType(req, res);
  }
  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
