import NextAuth, { AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/db";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { ERRORS } from "../../../lib/errors";
import {
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
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

          console.log("body", credential);

          const user = await prisma.user.findFirst({
            where: {
              authenticators: { some: { credentialID: credential.id } },
            },
            select: {
              currentWebauthnChallenge: true,
              authenticators: true,
              email: true,
              name: true,
              id: true,
            },
          });

          console.log("user", user);

          if (!user?.currentWebauthnChallenge || !user?.authenticators.length) {
            return null;
          }

          const { verified, authenticationInfo } =
            await verifyAuthenticationResponse({
              credential,
              expectedChallenge: user.currentWebauthnChallenge,
              expectedOrigin: process.env.WEBAUTHN_ORIGIN,
              expectedRPID: process.env.WEBAUTHN_RELAYING_PARTY_ID,
              authenticator: user.authenticators[0],
            });

          console.log("response", verified, authenticationInfo);

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

            console.log("logged in");

            return {
              id: user.id,
              email: user.email,
              name: user.name,
            };
          }
        } catch (err) {
          console.error("errr", err);
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      console.log("sign in callback", user);
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
