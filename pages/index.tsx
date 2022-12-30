import Head from "next/head";
import { useSession } from "next-auth/react";
import { Button, Loader, Message, Panel } from "rsuite";
import { Alert as DBAlert } from "@prisma/client";
import useSWR from "swr";

import styles from "../styles/Home.module.css";
import { fetcher } from "../lib/helpers";
import Alert from "../components/Alert";

export default function Home() {
  const { data: session } = useSession();
  const {
    data: alerts,
    error,
    isLoading,
  } = useSWR("/api/alerts?json=1", fetcher);

  const alertsByStatus: {
    published: DBAlert[];
    draft: DBAlert[];
    template: DBAlert[];
    expired: DBAlert[];
  } = {
    published: [],
    draft: [],
    template: [],
    expired: [],
  };

  if (alerts && !alerts?.error) {
    for (let i = 0; i < alerts.alerts.length; i++) {
      const alert = alerts.alerts[i];
      if (alert.status === "DRAFT") {
        alertsByStatus.draft.push(alert);
      } else if (alert.status === "TEMPLATE") {
        alertsByStatus.template.push(alert);
      } else if (alert.status === "PUBLISHED") {
        if (new Date(alert?.data?.info?.[0]?.expires) < new Date()) {
          alertsByStatus.expired.push(alert);
        } else {
          alertsByStatus.published.push(alert);
        }
      }
    }
  }

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
          <p>
            <Button color="violet" appearance="primary">
              Register with your Alerting Authority &rarr;
            </Button>
          </p>
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

            {!error && !alerts?.error && (
              <>
                {Object.entries(alertsByStatus).map(
                  ([status, alertsForStatus]) => (
                    <Panel
                      key={`alerts-${status}-${alertsForStatus.length}`}
                      header={`${status} alerts`}
                      className={styles.alertStatusWrapper}
                      defaultExpanded={!!alertsForStatus.length}
                      collapsible
                      bordered
                    >
                      <div className={styles.alertsWrapper}>
                        {!alertsForStatus.length && <p>No alerts</p>}
                        {alertsForStatus.map((a) => (
                          <Alert key={`alert-${a.id}`} alert={a} />
                        ))}
                      </div>
                    </Panel>
                  )
                )}
              </>
            )}
          </>
        )}
      </main>
    </>
  );
}
