import { Trans } from "@lingui/macro";
import Head from "next/head";
import { Message } from "rsuite";

export default function VerifyRequestPage() {
  return (
    <>
      <Head>
        <title>CAP Editor | Login</title>
      </Head>
      <main className="centered-message">
        <Message
          type="info"
          showIcon
          header={
            <strong>
              <Trans>Please check your email</Trans>
            </strong>
          }
        >
          <p>
            <Trans>A sign in link has been sent to your email address.</Trans>
          </p>
        </Message>
      </main>
    </>
  );
}
