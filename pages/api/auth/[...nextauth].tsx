import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  callbacks: {
    async signIn({ user, email }) {
      if (
        email?.verificationRequest &&
        !(await prisma.user.findFirst({ where: { email: user.email } }))
      ) {
        // TODO user needs to register: alerting authority needs to verify user
        return `/register?email=${user.email}`;
      }

      return true;
    },
  },
};
export default NextAuth(authOptions);
