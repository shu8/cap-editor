import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/react";
import RegisterForm from "../components/RegisterForm";
import { useRouter } from "next/router";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  console.log(router.query.email as string);
  return (
    <>
      <Head>
        <title>CAP Editor | Register</title>
      </Head>
      <main className={styles.main}>
        <RegisterForm
          email={router.query.email ? (router.query.email as string) : ""}
        />
      </main>
    </>
  );
}
