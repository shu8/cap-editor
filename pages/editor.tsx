import Head from "next/head";
import NewAlert, { AlertData } from "../components/editor/NewAlert";
import prisma from "../lib/prisma";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import { AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) return { props: {} };

  const user = await prisma.user.findFirst({
    where: { email: session.user.email },
    include: { alertingAuthority: true },
  });

  return {
    props: { alertingAuthority: user?.alertingAuthority, roles: user?.roles },
  };
};

export default function Home({
  alertingAuthority,
  roles,
}: {
  alertingAuthority: AlertingAuthority;
  roles: Role[];
}) {
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
          roles={roles}
          onSubmit={async (alertData: AlertData, alertStatus: AlertStatus) => {
            fetch("/api/alerts", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: alertStatus, data: alertData }),
            });
          }}
        />
      </main>
    </>
  );
}
