import Head from "next/head";
import prisma from "../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";

export const getServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) return { props: {} };

  const alertingAuthority = await prisma.alertingAuthority.findFirst({
    where: { users: { some: { email: session.user.email } } },
  });
  return { props: { alertingAuthority } };
};

export default function Home({ alertingAuthority }) {
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
