import Head from "next/head";
import NewAlert, { AlertData } from "../components/cap/NewAlert";
import prisma from "../lib/db";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) return { props: { session } };

  const alertingAuthority = await prisma.alertingAuthority.findFirst({
    where: { users: { some: { email: session.user.email } } },
  });
  console.log(session, alertingAuthority);
  return { props: { session, alertingAuthority } };
};

export default function Home({ session, alertingAuthority }) {
  console.log(session, alertingAuthority);

  return (
    <>
      <Head>
        <title>CAP Editor - Edit</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NewAlert
          alertingAuthority={alertingAuthority}
          onSubmit={async (alertData: AlertData) => {
            fetch("/api/alerts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...alertData }),
            });
          }}
        />
      </main>
    </>
  );
}
