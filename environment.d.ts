declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BASE_URL: string;
      PRIVATE_KEY_FILENAME: string;
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: number;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      EMAIL_FROM: string;
      NODE_ENV: "development" | "production";
      WEBAUTHN_RELAYING_PARTY_NAME: string;
      WEBAUTHN_RELAYING_PARTY_ID: string;
      WEBAUTHN_ORIGIN: string;
      TLS_DIRECTORY: string;
      WHAT_NOW_API_KEY: string;
      REDIS_HOST: string;
      IFRC_AA_VERIFIER_EMAIL: string;
    }
  }
}

export {};
