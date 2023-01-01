import { Message } from "rsuite";
import { HandledError } from "../lib/helpers";

export default function ErrorMessage({
  error,
  action,
}: {
  error: Error;
  action: string;
}) {
  if (error instanceof HandledError) {
    return (
      <Message closable type="error" duration={0}>
        There was an error {action}: {error.message}
      </Message>
    );
  } else {
    return (
      <Message closable type="error" duration={0}>
        There was an error {action}. Please try again later or contact your
        administrator if the issue persists.
      </Message>
    );
  }
}
