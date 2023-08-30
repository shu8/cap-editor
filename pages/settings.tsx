import { t, Trans } from "@lingui/macro";
import {
  browserSupportsWebAuthn,
  startRegistration,
} from "@simplewebauthn/browser";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Button, Message, Panel } from "rsuite";

import ConnectToAlertingAuthorityForm from "../components/ConnectToAlertingAuthorityForm";
import ErrorMessage from "../components/ErrorMessage";
import UpdateAlertingAuthorityDetailsForm from "../components/UpdateAlertingAuthorityDetailsForm";
import UpdatePersonalDetailsForm from "../components/UpdatePersonalDetailsForm";
import { useAlertingAuthorityLocalStorage } from "../lib/useLocalStorageState";
import { useToasterI18n } from "../lib/useToasterI18n";
import { authOptions } from "./api/auth/[...nextauth]";

export default function SettingsPage() {
  const toaster = useToasterI18n();
  const { data: session } = useSession();
  const [alertingAuthorityId] = useAlertingAuthorityLocalStorage();

  return (
    <>
      <Head>
        <title>CAP Editor - Settings</title>
      </Head>

      <main>
        <h2>
          <Trans>Settings</Trans>
        </h2>

        {session?.user?.alertingAuthorities?.[
          alertingAuthorityId
        ]?.roles.includes("ADMIN") && (
          <Panel header="Alerting Authority settings" bordered>
            <UpdateAlertingAuthorityDetailsForm
              alertingAuthorityId={alertingAuthorityId}
            />
          </Panel>
        )}

        {browserSupportsWebAuthn() && (
          <Panel header="Security" bordered>
            <p>
              <Trans>
                Depending on your device, you can register your fingerprint,
                face, or PIN for easier login in future. You can also register
                your security key, if you have one.
              </Trans>
            </p>

            <Button
              appearance="primary"
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
                      <Message type="success" closable>
                        <Trans>
                          This device has been successfully registered for
                          WebAuthn authentication
                        </Trans>
                        .
                      </Message>,
                      { duration: 3000 }
                    );
                  } else {
                    throw new Error("Failed to register", verification);
                  }
                } catch (err) {
                  console.error("Failed to register your device", err);
                  toaster.push(
                    <ErrorMessage
                      error={err}
                      action={t`registering for WebAuthn`}
                    />
                  );
                }
              }}
            >
              Setup fingerprint, face, PIN, or security key
            </Button>
          </Panel>
        )}

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
