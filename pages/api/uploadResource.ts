import type { NextApiRequest, NextApiResponse } from "next";
import { ApiError } from "next/dist/server/api-utils";

import formidable from "formidable";
import { getServerSession } from "next-auth";
import { withErrorHandler } from "../../lib/apiErrorHandler";
import { authOptions } from "./auth/[...nextauth]";
import minioClient from "../../lib/minio";
import { randomUUID } from "crypto";

export const config = {
  api: { bodyParser: false },
};

const getFormData = async (req: NextApiRequest) => {
  const form = formidable({
    allowEmptyFiles: false,
    maxFiles: 1,
    maxFileSize: 5 * 1024 * 1024, // 5Mb
    maxFields: 1,
    multiples: false,
    keepExtensions: true,
    filter: (part) => part.mimetype?.includes("image") ?? false,
    filename: (_, ext) => `${randomUUID()}${ext}`,
  });
  const parsedForm = await form.parse(req);
  const files = parsedForm[1];
  if (files?.resourceFile?.length !== 1) {
    throw new ApiError(
      400,
      "You did not provide a valid file to upload. Only images of less than <5Mb are supported"
    );
  }

  return files.resourceFile[0];
};

async function handleUploadResource(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) throw new ApiError(403, "You are not logged in");

  const file = await getFormData(req);
  await minioClient.fPutObject(
    process.env.RESOURCES_S3_BUCKET_NAME,
    file.newFilename,
    file.filepath,
    { "Content-Type": file.mimetype }
  );

  return res.json({
    error: false,
    url: `${process.env.RESOURCES_S3_BASE_PUBLIC_URL}/resources/${file.newFilename}`,
  });
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return handleUploadResource(req, res);
  }

  return res.status(405).send("Method not allowed");
}

export default withErrorHandler(handler);
