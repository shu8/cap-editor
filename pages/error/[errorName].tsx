import Head from "next/head";
import styles from "../../styles/Home.module.css";
import { ERRORS } from "../../lib/errors";
import { useRouter } from "next/router";

export default function ErrorPage() {
  const router = useRouter();
  const { errorName } = router.query;

  return (
    <>
      <Head>
        <title>CAP Editor - Error</title>
      </Head>
      <main className={styles.main}>
        {Object.values(ERRORS).find((e) => e.slug === errorName)?.message ??
          "There was an unexpected error. Please try again"}
      </main>
    </>
  );
}
