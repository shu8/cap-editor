import Head from "next/head";
import { ERRORS } from "../../lib/errors";
import { useRouter } from "next/router";
import { Message } from "rsuite";

export default function ErrorPage() {
  const router = useRouter();
  const { errorName } = router.query;

  return (
    <>
      <Head>
        <title>CAP Editor - Error</title>
      </Head>
      <main className="centered-message">
        <Message type="error">
          {Object.values(ERRORS).find((e) => e.slug === errorName)?.message ??
            "There was an unexpected error. Please try again"}
        </Message>
      </main>
    </>
  );
}
