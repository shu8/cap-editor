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
  session: { strategy: "jwt" },
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
      maxAge: 600, // 10 minutes
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

          const expectedChallenge = await redis.hGet(
            "webauthn-auth-challenges",
            tempWebauthnUserId
          );

          if (!expectedChallenge) {
            deleteCookie("webauthn-user-id", { req });
            return null;
          }

          const user = await prisma.user.findFirst({
            where: { webauthnId: credential.response.userHandle },
            select: {
              currentWebauthnChallenge: true,
              authenticators: true,
              email: true,
              name: true,
              id: true,
            },
          });

          // At this point, the user should not have any pending challenge in the DB
          // They should only have the pending usernameless auth challenge in redis
          // And they should have at least one authenticator in the DB
          if (
            user?.currentWebauthnChallenge != null ||
            !user?.authenticators.length
          ) {
            deleteCookie("webauthn-user-id", { req });
            await redis.hDel("webauthn-auth-challenges", tempWebauthnUserId);
            return null;
          }

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

          await redis.hDel("webauthn-auth-challenges", tempWebauthnUserId);
        } catch (err) {
          console.error("errr", err);
        } finally {
          deleteCookie("webauthn-user-id", { req });
        }

        return null;
      },
    }),
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
