import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import AuthenticateForm from "../components/AuthenticateForm";

export default function Home() {
  const { data: session } = useSession();
  console.log(session);

  return (
    <>
      <Head>
        <title>CAP Editor</title>
        <meta name="description" content="CAP Editor" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <AuthenticateForm />
      </main>
    </>
  );
}
