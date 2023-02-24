import { t, Trans } from "@lingui/macro";
import { startRegistration } from "@simplewebauthn/browser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Button, Message, Panel } from "rsuite";

import ConnectToAlertingAuthorityForm from "../components/ConnectToAlertingAuthorityForm";
import ErrorMessage from "../components/ErrorMessage";
import UpdatePersonalDetailsForm from "../components/UpdatePersonalDetailsForm";
import { useToasterI18n } from "../lib/useToasterI18n";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SettingsPage() {
  const toaster = useToasterI18n();
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>CAP Editor - Settings</title>
      </Head>

      <main>
        <h2>
          <Trans>Settings</Trans>
        </h2>
        <Panel header="Security" bordered>
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
                        This device has been successfully registered for
                        WebAuthn authentication
                      </Trans>
                      .
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
        </Panel>

        <Panel header="Personal Details" bordered>
          <UpdatePersonalDetailsForm />
        </Panel>

        <Panel header="Connect to Alerting Authorities" bordered>
          {session?.user.name ? (
            <ConnectToAlertingAuthorityForm />
          ) : (
            <Message type="error">
              <Trans>
                Please provide your name (above) before connecting to your
                Alerting Authority
              </Trans>
              .
            </Message>
          )}
        </Panel>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/login", permanent: false } };
  }
  return { props: {} };
};
