import Head from "next/head";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "../lib/helpers";
import Alert from "../components/Alert";
import { Loader, Message, Panel } from "rsuite";

export default function Dashboard() {
  const {
    data: alerts,
    error,
    isLoading,
  } = useSWR("/api/alerts?json=1", fetcher);

  return (
    <>
      <Head>
        <title>CAP Editor</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {isLoading && (
          <Loader size="lg" backdrop center content="Loading alerts..." />
        )}

        {error && (
          <Message type="error">There was an error loading the alerts</Message>
        )}

        {!error && alerts?.success && (
          <>
            <Panel header="Active alerts" bordered>
              {alerts.alerts.map((a) => (
                <Alert key={`alert-${a.id}`} capAlert={a.data} />
              ))}
            </Panel>
            <Panel header="Past alerts" bordered></Panel>
          </>
        )}
      </main>
    </>
  );
}
