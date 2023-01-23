import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import AuthenticateForm from "../../components/AuthenticateForm";
import { startAuthentication } from "@simplewebauthn/browser";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import { Trans } from "@lingui/macro";

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
  const router = useRouter();
  const { error } = router.query;

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

    if (
      sessionStatus !== "loading" &&
      !session &&
      !window.location.search.includes("error")
    ) {
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
      {error ? (
        <main className="centered-message">
          <Message type="error">
            <Trans>
              There was an error logging in. Please try again later or contact
              your administrator if the issue persists.
            </Trans>
          </Message>
        </main>
      ) : (
        <main>
          <AuthenticateForm />
        </main>
      )}
    </>
  );
}
