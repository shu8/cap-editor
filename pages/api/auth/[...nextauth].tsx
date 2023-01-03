import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { Role } from "@prisma/client";
import { deleteCookie, getCookie } from "cookies-next";

import prisma from "../../../lib/prisma";
import { ERRORS } from "../../../lib/errors";
import redis from "../../../lib/redis";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  // 2 day sessions
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 2 },
  pages: {
    signIn: "/login",
    verifyRequest: "/auth/verify-request",
    error: "/error",
  },
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
      // 10 minute email links
      maxAge: 600,
      from: process.env.EMAIL_FROM,
    }),
    // https://dev.to/jsombie/password-less-authentication-in-nextjs-application-with-webauthn-and-nextauth-3mgl
    CredentialsProvider({
      id: "webauthn",
      credentials: {},
      async authorize(cred, req) {
        try {
          const credential = req.body;
          credential.clientExtensionResults = {
            appid: credential.appid,
            credProps: credential.credProps,
            devicePubKey: credential.devicePubKey,
            uv: credential.uvm,
          };
          credential.response = {
            authenticatorData: credential.authenticatorData,
            clientDataJSON: credential.clientDataJSON,
            signature: credential.signature,
            userHandle: credential.userHandle,
          };

          const tempWebauthnUserId = getCookie("webauthn-user-id", { req });
          if (typeof tempWebauthnUserId !== "string") return null;
          deleteCookie("webauthn-user-id", { req });

          const redisKey = `webauthn-auth:${tempWebauthnUserId}`;
          const expectedChallenge = await redis.hGet(redisKey, "challenge");
          if (!expectedChallenge) return null;
          await redis.hDel(redisKey, tempWebauthnUserId);

          const user = await prisma.user.findFirst({
            where: { webauthnId: credential.response.userHandle },
            select: { authenticators: true, email: true, name: true, id: true },
          });

          if (!user?.authenticators.length) return null;

          const { verified, authenticationInfo } =
            await verifyAuthenticationResponse({
              credential,
              expectedChallenge: expectedChallenge,
              expectedOrigin: process.env.WEBAUTHN_ORIGIN,
              expectedRPID: process.env.WEBAUTHN_RELAYING_PARTY_ID,
              authenticator: user.authenticators[0],
              requireUserVerification: true,
            });

          if (verified && authenticationInfo) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                authenticators: {
                  update: {
                    where: {
                      credentialID:
                        authenticationInfo.credentialID.toString("base64url"),
                    },
                    data: { counter: authenticationInfo.newCounter },
                  },
                },
              },
            });

            return { id: user.id, email: user.email, name: user.name };
          }
        } catch (err) {
          console.error("WebAuthn login error", err);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return "/register";

      const dbUser = await prisma.user.findFirst({
        where: { email: user.email },
      });

      // If user doesn't exist in db yet, they need to register first
      if (!dbUser) return `/register?email=${user.email}`;

      // If user is in db, but their AS hasn't verified them, they can't login yet
      if (!dbUser.alertingAuthorityVerified) {
        return `/error/${ERRORS.ACCOUNT_NOT_VERIFIED_YET.slug}`;
      }

      // In all other cases, allow login
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account) {
        const user = await prisma.user.findFirst({
          where: { id: profile?.sub },
          select: { roles: true },
        });
        if (!user) return token;

        token.roles = user.roles;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.roles = token.roles as Role[];
      return session;
    },
  },
};

export default NextAuth(authOptions);
