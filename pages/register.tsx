import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import RegisterForm from "../components/RegisterForm";

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>CAP Editor | Register</title>
      </Head>
      <main className={styles.main}>
        <RegisterForm />
      </main>
    </>
  );
}
