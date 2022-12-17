import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import mongoPromise from "../../../lib/db";

export const authOptions = {
  adapter: MongoDBAdapter(mongoPromise),
  providers: [
    // https://github.com/nextauthjs/next-auth/discussions/3154 - custom sign in page
    EmailProvider({
      id: "email",
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    // https://dev.to/jsombie/password-less-authentication-in-nextjs-application-with-webauthn-and-nextauth-3mgl
    // CredentialsProvider({
    //   name: 'webauthn'
    // })
  ],
};
export default NextAuth(authOptions);
