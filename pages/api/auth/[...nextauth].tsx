import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { verifyAuthenticationResponse } from "@simplewebauthn/server";
import { deleteCookie, getCookie } from "cookies-next";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";

import {
  REDIS_KEY_PENDING_SESSION_UPDATES,
  REDIS_PREFIX_WEBAUTHN_AUTH_CHALLENGE,
} from "../../../lib/constants";
import prisma from "../../../lib/prisma";
import redis from "../../../lib/redis";
import { UserAlertingAuthorities } from "../../../lib/types/types";

const getUser = async (email: string) => {
  const user = await prisma.user.findFirst({
    where: { email },
    include: {
      AlertingAuthorities: {
        select: {
          AlertingAuthority: {
            select: {
              name: true,
              countryCode: true,
              id: true,
              polygon: true,
              defaultTimezone: true,
              severityCertaintyMatrixEnabled: true,
              author: true,
            },
          },
          roles: true,
        },
        where: { verified: { not: null }, User: { email } },
      },
    },
  });
  return user;
};

const mapAlertingAuthorities = (
  user: NonNullable<Awaited<ReturnType<typeof getUser>>>
) =>
  user.AlertingAuthorities.reduce((acc, cur) => {
    acc[cur.AlertingAuthority.id] = {
      id: cur.AlertingAuthority.id,
      name: cur.AlertingAuthority.name,
      countryCode: cur.AlertingAuthority.countryCode,
      polygon: cur.AlertingAuthority.polygon,
      defaultTimezone: cur.AlertingAuthority.defaultTimezone,
      roles: cur.roles,
      severityCertaintyMatrixEnabled:
        cur.AlertingAuthority.severityCertaintyMatrixEnabled,
      author: cur.AlertingAuthority.author,
    };
    return acc;
  }, {} as UserAlertingAuthorities);

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
          if (!credential) return null;

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

          const redisKey = `${REDIS_PREFIX_WEBAUTHN_AUTH_CHALLENGE}:${tempWebauthnUserId}`;
          const expectedChallenge = await redis.HGET(redisKey, "challenge");
          if (!expectedChallenge) return null;
          await redis.HDEL(redisKey, tempWebauthnUserId);

          const user = await prisma.user.findFirst({
            where: { webauthnId: credential.response.userHandle },
            select: { Authenticators: true, email: true, name: true, id: true },
          });

          if (!user?.Authenticators.length) return null;

          const { verified, authenticationInfo } =
            await verifyAuthenticationResponse({
              credential,
              expectedChallenge: expectedChallenge,
              expectedOrigin: process.env.WEBAUTHN_ORIGIN,
              expectedRPID: process.env.WEBAUTHN_RELYING_PARTY_ID,
              authenticator: user.Authenticators[0],
              requireUserVerification: true,
            });

          if (verified && authenticationInfo) {
            await prisma.user.update({
              where: { email: user.email },
              data: {
                Authenticators: {
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

      // In all other cases, allow login
      return true;
    },
    async jwt({ token, account }) {
      if (!token?.email) return token;

      // Only do (expensive) DB call on first login, or if there is a pending session
      //  update from elsewhere in app for this user
      if (
        account ||
        (await redis.SREM(REDIS_KEY_PENDING_SESSION_UPDATES, token.email))
      ) {
        const user = await getUser(token?.email);
        if (!user) return token;
        token.name = user.name;
        token.alertingAuthorities = mapAlertingAuthorities(user);
      }

      return token;
    },
    async session({ session, token }) {
      if (token.name) session.user.name = token.name;
      session.user.alertingAuthorities = (token.alertingAuthorities ||
        {}) as UserAlertingAuthorities;

      return session;
    },
  },
};

export default NextAuth(authOptions);
