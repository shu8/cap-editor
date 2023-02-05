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
import { AlertingAuthority } from "../../../lib/types/types";

const getUser = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      UserAlertingAuthorities: {
        select: {
          alertingAuthority: {
            select: { name: true, countryCode: true, id: true },
          },
          roles: true,
        },
        where: {
          alertingAuthorityVerified: { not: null },
          user: { email },
        },
      },
    },
  });
  return user;
};

const mapAlertingAuthorities = (
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>
) =>
  user.UserAlertingAuthorities.reduce((acc, cur) => {
    acc[cur.alertingAuthority.id] = {
      id: cur.alertingAuthority.id,
      name: cur.alertingAuthority.name,
      countryCode: cur.alertingAuthority.countryCode,
      roles: cur.roles,
    };
    return acc;
  }, {});

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
          const expectedChallenge = await redis.HGET(redisKey, "challenge");
          if (!expectedChallenge) return null;
          await redis.HDEL(redisKey, tempWebauthnUserId);

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

      // If user is in db, but their AA hasn't verified them, they can't login yet
      // TODO move this to a persistent banner when logged in, preventing them from doing anything
      // if (!dbUser.alertingAuthorityVerified) {
      //   return `/error/${ERRORS.ACCOUNT_NOT_VERIFIED_YET.slug}`;
      // }

      // In all other cases, allow login
      return true;
    },
    async jwt({ token, account }) {
      if (account && token?.email) {
        const user = await getUser(token?.email);
        if (!user) return token;
        token.alertingAuthorities = mapAlertingAuthorities(user);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.alertingAuthorities = (token.alertingAuthorities || {}) as {
        string: AlertingAuthority;
      };

      // Only do (expensive) DB call if there is a pending session update from elsewhere in app for this user
      if (await redis.SREM("pendingSessionUpdates", session.user.email)) {
        const user = await getUser(session.user.email);
        if (user) {
          session.user.name = user.name;
          session.user.alertingAuthorities = mapAlertingAuthorities(user);
        }
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
