import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import prisma from "../../../lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { ERRORS } from "../../../lib/errors";

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
    async signIn({ user }) {
      if (!user.email) {
        return "/register";
      }

      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
      });

      // If user doesn't exist in db yet, they need to register first
      if (!dbUser) {
        return `/register?email=${user.email}`;
      }

      // If user is in db, but their AS hasn't verified them, they can't login yet
      if (!dbUser.alertingAuthorityVerified) {
        return `/error/${ERRORS.ACCOUNT_NOT_VERIFIED_YET.slug}`;
      }

      // In all other cases, allow login
      return true;
    },
  },
};

export default NextAuth(authOptions);
