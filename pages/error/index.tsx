import Head from "next/head";
import { ERRORS } from "../../lib/errors";
import { useRouter } from "next/router";
import { Message } from "rsuite";

export default function NextAuthErrorPage() {
  const router = useRouter();
  const { error } = router.query;

  const messages = {
    AccessDenied:
      "You do not have permission to log in yet. Your account may not be verified yet",
    Verification: "There was an error logging in. Your token may have expired",
  };

  return (
    <>
      <Head>
        <title>CAP Editor - Error</title>
      </Head>
      <main className="centered-message">
        <Message type="error">
          {messages[error] ??
            "There was an unexpected error. Please try again later or contact your administrator if the issue persists"}
          .
        </Message>
      </main>
    </>
  );
}
