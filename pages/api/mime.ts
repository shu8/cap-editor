import { readFileSync } from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth";
import { ApiError } from "next/dist/server/api-utils";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import { authOptions } from "./auth/[...nextauth]";
import MIMEType from "whatwg-mimetype";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (req.method === "GET") {
    if (!session) throw new ApiError(401, 'You are not logged in');

    const { url } = req.query;
    if (typeof url !== 'string') throw new ApiError(400, 'You did not provide a valid URL');

    try {
      const response = await fetch(url);
      if (response.status !== 200) throw new ApiError(400, 'You did not provide a valid URL');

      const contentType = response.headers.get('Content-Type');
      if (!contentType) return res.json({ error: false, mime: 'application/octet-stream' });

      const mime = new MIMEType(contentType).essence;
      return res.json({ error: false, mime });
    } catch (err) {
      throw new ApiError(400, 'Unable to access resource');
    }
  }
}

export default withErrorHandler(handler);
