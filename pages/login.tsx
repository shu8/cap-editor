import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import AuthenticateForm from "../components/AuthenticateForm";
import { startAuthentication } from "@simplewebauthn/browser";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};

export default function Login() {
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    async function initUsernamelessLogin() {
      const options = await fetch("/api/webauthn/authenticate").then((res) =>
        res.json()
      );
      const auth = await startAuthentication(options);
      await signIn("webauthn", {
        ...auth,
        ...auth.clientExtensionResults,
        ...auth.response,
      });
    }

    if (sessionStatus !== "loading" && !session) {
      initUsernamelessLogin().catch((err) =>
        console.error("Failed to start usernameless login", err)
      );
    }
  }, [session, sessionStatus]);

  return (
    <>
      <Head>
        <title>CAP Editor | Login</title>
      </Head>
      <main>
        <AuthenticateForm />
      </main>
    </>
  );
}
