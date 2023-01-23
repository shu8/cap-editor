import Head from "next/head";
import { ERRORS } from "../../lib/errors";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import { t } from "@lingui/macro";

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
            t`There was an unexpected error. Please try again`}
        </Message>
      </main>
    </>
  );
}
