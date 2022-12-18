declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DOMAIN: string;
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: number;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      EMAIL_FROM: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

export { };
