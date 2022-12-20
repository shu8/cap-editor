import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import { startRegistration } from "@simplewebauthn/browser";

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
        {session ? "You are logged in" : "You are not logged in"}
        {session && (
          <button
            onClick={async () => {
              const options = await fetch("/api/webauthn/register").then(
                (res) => res.json()
              );
              const credential = await startRegistration(options);
              console.log(credential);

              const verification = await fetch("/api/webauthn/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credential),
              }).then((res) => res.json());

              console.log(verification);
              if (verification?.verified) {
                alert("Registered");
              }
            }}
          >
            Register WebAuthn
          </button>
        )}
      </main>
    </>
  );
}
