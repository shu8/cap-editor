import { t } from "@lingui/macro";
import Head from "next/head";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import { ERRORS } from "../../lib/errors";

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
            t`There was an unexpected error. Please try again later or contact your administrator if the issue persists`}
        </Message>
      </main>
    </>
  );
}
