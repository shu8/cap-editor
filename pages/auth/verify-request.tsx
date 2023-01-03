import { Message } from "rsuite";

export default function VerifyRequestPage() {
  return (
    <main className="centered-message">
      <Message
        type="info"
        showIcon
        header={<strong>Please check your email</strong>}
      >
        <p>A sign in link has been sent to your email address.</p>
      </Message>
    </main>
  );
}
