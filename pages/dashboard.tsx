import Head from "next/head";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import { fetcher } from "../lib/helpers";
import Alert from "../components/Alert";

export default function Dashboard() {
  const { data: session } = useSession();
  const {
    data: alerts,
    error,
    isLoading,
  } = useSWR("/api/alerts?json=1", fetcher);

  console.log(alerts);
  return (
    <>
      <Head>
        <title>CAP Editor</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {alerts?.success &&
          alerts.alerts.map((a) => (
            <Alert key={`alert-${a.id}`} capAlert={a.data} />
          ))}
      </main>
    </>
  );
}
