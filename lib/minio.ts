import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: process.env.RESOURCES_S3_BASE_URL,
  port: +process.env.RESOURCES_S3_PORT,
  // If using e.g., Minio locally, don't use SSL
  useSSL: !process.env.RESOURCES_S3_IS_LOCAL,
  accessKey: process.env.RESOURCES_S3_ACCESS_KEY,
  secretKey: process.env.RESOURCES_S3_SECRET_KEY,
});

export default minioClient;
