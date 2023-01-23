import { startRegistration } from "@simplewebauthn/browser";
import { Button, Message, useToaster } from "rsuite";
import Head from "next/head";
import ErrorMessage from "../components/ErrorMessage";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { t, Trans } from "@lingui/macro";

export default function SettingsPage() {
  const toaster = useToaster();

  return (
    <>
      <Head>
        <title>CAP Editor - Settings</title>
      </Head>

      <main>
        <h2>
          <Trans>Settings</Trans>
        </h2>
        <Button
          appearance="primary"
          style={{ width: "200px" }}
          onClick={async () => {
            try {
              const options = await fetch("/api/webauthn/register").then(
                (res) => res.json()
              );
              const credential = await startRegistration(options);
              const verification = await fetch("/api/webauthn/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credential),
              }).then((res) => res.json());

              if (!verification?.error) {
                toaster.push(
                  <Message type="success" duration={0} closable>
                    <Trans>
                      This device has been successfully registered for WebAuthn
                      authentication.
                    </Trans>
                  </Message>
                );
              } else {
                throw new Error("Failed to register", verification);
              }
            } catch (err) {
              console.error("Failed to register WebAuthn", err);
              toaster.push(
                <ErrorMessage
                  error={err}
                  action={t`registering for WebAuthn`}
                />
              );
            }
          }}
        >
          Register WebAuthn
        </Button>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
};
