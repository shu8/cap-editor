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
          header={<strong>Please check your email</strong>}
        >
          <p>A sign in link has been sent to your email address.</p>
        </Message>
      </main>
    </>
  );
}
