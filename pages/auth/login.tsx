import { Trans } from "@lingui/macro";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Message } from "rsuite";

import AuthenticateForm from "../../components/AuthenticateForm";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) return { redirect: { destination: "/", permanent: false } };
  return { props: {} };
};

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  const { error } = router.query;

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
          <AuthenticateForm session={session} />
        </main>
      )}
    </>
  );
}
