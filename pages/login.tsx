import Head from "next/head";
import styles from "../styles/Home.module.css";
import { signIn, useSession } from "next-auth/react";
import AuthenticateForm from "../components/AuthenticateForm";
import { startAuthentication } from "@simplewebauthn/browser";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>CAP Editor</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <AuthenticateForm />
        <button
          onClick={async () => {
            const options = await fetch(
              "/api/webauthn/authenticate?email=shubham@sjain.dev"
            ).then((res) => res.json());
            const auth = await startAuthentication(options);
            await signIn("webauthn", {
              ...auth,
              ...auth.clientExtensionResults,
              ...auth.response,
            });
          }}
        >
          WebAuthn login
        </button>
      </main>
    </>
  );
}
