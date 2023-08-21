import { t, Trans } from "@lingui/macro";
import { Alert as DBAlert } from "@prisma/client";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button, Loader, Message, Panel } from "rsuite";
import useSWR from "swr";

import Alert from "../components/Alert";
import { fetcher } from "../lib/helpers.client";
import { useAlertingAuthorityLocalStorage } from "../lib/useLocalStorageState";
import styles from "../styles/Home.module.css";
import ExportAlerts from "../components/ExportAlerts";

export default function Home() {
  const { data: session } = useSession();
  const [alertingAuthorityId] = useAlertingAuthorityLocalStorage();

  const {
    data: alerts,
    error,
    isLoading,
  } = useSWR(
    alertingAuthorityId
      ? `/api/alerts/alertingAuthorities/${alertingAuthorityId}`
      : null,
    fetcher
  );

  const {
    data: sharedAlerts,
    error: sharedAlertsError,
    isLoading: sharedAlertsLoading,
  } = useSWR("/api/alerts/shared", fetcher);

  const alertsByStatus: {
    published: DBAlert[];
    draft: DBAlert[];
  } = {
    published: [],
    draft: [],
  };

  if (alerts && !alerts?.error) {
    for (let i = 0; i < alerts.alerts.length; i++) {
      const alert = alerts.alerts[i];
      if (alert.status === "DRAFT") {
        alertsByStatus.draft.push(alert);
      } else if (alert.status === "PUBLISHED") {
        alertsByStatus.published.push(alert);
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
          <Trans>
            The CAP Editor tool allows you to create public hazard and emergency
            alerts and immediately publish them to an XML-based feed.
          </Trans>
        </p>

        {!session && (
          <p>
            <Link href="/register">
              <Button color="violet" appearance="primary">
                <Trans>Register with your Alerting Authority</Trans> &rarr;
              </Button>
            </Link>
          </p>
        )}

        {session && (
          <>
            <Link href={`/editor?alertingAuthorityId=${alertingAuthorityId}`}>
              <Button
                appearance="ghost"
                color="violet"
                className={styles.button}
              >
                <Trans>Create alert</Trans>
              </Button>
            </Link>

            {isLoading && (
              <Loader
                size="lg"
                backdrop
                center
                content={t`Loading alerts...`}
              />
            )}

            {(error || alerts?.error) && (
              <Message type="error">
                <Trans>There was an error loading the alerts</Trans>
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
                        {!alertsForStatus.length && (
                          <p>
                            <Trans>No alerts</Trans>
                          </p>
                        )}
                        {alertsForStatus.map((a) => (
                          <Alert key={`alert-${a.id}`} alert={a} />
                        ))}
                      </div>
                    </Panel>
                  )
                )}

                <ExportAlerts
                  languages={[
                    ...new Set(
                      alerts?.alerts?.map((a) => a.language as string) ?? []
                    ),
                  ]}
                />
              </>
            )}

            {!sharedAlertsError &&
              !sharedAlerts?.error &&
              sharedAlerts?.alerts.length > 0 && (
                <Panel
                  header={`Shared alerts`}
                  className={styles.alertStatusWrapper}
                  defaultExpanded={true}
                  collapsible
                  bordered
                >
                  {sharedAlertsLoading && (
                    <Loader
                      size="lg"
                      backdrop
                      center
                      content={t`Loading shared alerts...`}
                    />
                  )}

                  <p className={styles.sharedAlertsDescription}>
                    <Trans>
                      The folllowing alerts have been shared with you to
                      collaborate on
                    </Trans>
                    :
                  </p>
                  <div className={styles.alertsWrapper}>
                    {sharedAlerts.alerts.map((a: DBAlert) => (
                      <Alert key={`alert-${a.id}`} alert={a} />
                    ))}
                  </div>
                </Panel>
              )}
          </>
        )}
      </main>
    </>
  );
}
