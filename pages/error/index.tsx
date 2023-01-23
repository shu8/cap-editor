import Head from "next/head";
import { ERRORS } from "../../lib/errors";
import { useRouter } from "next/router";
import { Message } from "rsuite";
import { t } from "@lingui/macro";

export default function NextAuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const messages = {
    AccessDenied: t`You do not have permission to log in yet. Your account may not be verified yet`,
    Verification: t`There was an error logging in. Your token may have expired`,
  };

  return (
    <>
      <Head>
        <title>CAP Editor - Error</title>
      </Head>
      <main className="centered-message">
        <Message type="error">
          {messages[error] ??
            t`There was an unexpected error. Please try again later or contact your administrator if the issue persists`}
          .
        </Message>
      </main>
    </>
  );
}
