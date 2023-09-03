import { t } from "@lingui/macro";
import Head from "next/head";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import { ERRORS } from "../../lib/errors";
import { useLingui } from "@lingui/react";

export default function ErrorPage() {
  const { i18n } = useLingui();
  const router = useRouter();
  const { errorName } = router.query;

  const message = Object.values(ERRORS).find(
    (e) => e.slug === errorName
  )?.message;

  return (
    <>
      <Head>
        <title>CAP Editor - Error</title>
      </Head>
      <main className="centered-message">
        <Message type="error">
          {message
            ? i18n._(message)
            : t`There was an unexpected error. Please try again later or contact your administrator if the issue persists`}
        </Message>
      </main>
    </>
  );
}
