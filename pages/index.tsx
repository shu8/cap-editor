import Head from "next/head";
import { useSession } from "next-auth/react";
import { startRegistration } from "@simplewebauthn/browser";
import { Button, Loader, Message, Panel } from "rsuite";
import useSWR from "swr";

import { fetcher } from "../lib/helpers";
import Alert from "../components/Alert";

export default function Home() {
  const { data: session } = useSession();
  const {
    data: alerts,
    error,
    isLoading,
  } = useSWR("/api/alerts?json=1", fetcher);

  console.log(session);

  return (
    <>
      <Head>
        <title>CAP Editor</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p>
          The CAP Editor tool allows you to create public hazard and emergency
          alerts and immediately publish them to an XML-based feed.
        </p>

        {!session && (
          <>
            <p>
              <Button color="violet" appearance="primary">
                Register with your Alerting Authority &rarr;
              </Button>
            </p>
          </>
        )}

        {session && (
          <>
            {isLoading && (
              <Loader size="lg" backdrop center content="Loading alerts..." />
            )}

            {error && (
              <Message type="error">
                There was an error loading the alerts
              </Message>
            )}

            {!error && alerts?.success && (
              <>
                <Panel
                  header="Active alerts"
                  bordered
                  collapsible
                  defaultExpanded
                >
                  {alerts.alerts.map((a) => (
                    <Alert key={`alert-${a.id}`} capAlert={a.data} />
                  ))}
                </Panel>
                <Panel header="Past alerts" bordered collapsible></Panel>
              </>
            )}

            <Button
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
            </Button>
          </>
        )}
      </main>
    </>
  );
}
