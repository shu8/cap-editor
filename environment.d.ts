declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;
      PRIVATE_KEY_FILENAME: string;
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: string;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      EMAIL_FROM: string;
      NODE_ENV: "development" | "production";
      WEBAUTHN_RELYING_PARTY_NAME: string;
      WEBAUTHN_RELYING_PARTY_ID: string;
      WEBAUTHN_ORIGIN: string;
      TLS_DIRECTORY: string;
      WHAT_NOW_API_KEY: string;
      REDIS_HOST: string;
      IFRC_AA_VERIFIER_EMAIL: string;
      RESOURCES_S3_BASE_URL: string;
      RESOURCES_S3_PORT: number;
      RESOURCES_S3_ACCESS_KEY: string;
      RESOURCES_S3_SECRET_KEY: string;
      RESOURCES_S3_BUCKET_NAME: string;
      RESOURCES_S3_BASE_PUBLIC_URL: string;
      RESOURCES_S3_IS_LOCAL: boolean;
    }
  }
}

export {};
