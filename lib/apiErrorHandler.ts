import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

export function withErrorHandler(handler: NextApiHandler) {
  return async function (req: NextApiRequest, res: NextApiResponse) {
    try {
      await handler(req, res);
    } catch (err) {
      let statusCode = 5000;
      let message = 'An unexpected error occurred. Please try again later or contact your administrator if the issue persists';
      if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
      } else {
        console.error('Unhandled error', err);
      }

      return res.status(statusCode).json({ error: true, message: message });
    }
  };
}
