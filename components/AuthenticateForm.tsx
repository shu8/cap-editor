import { signIn } from "next-auth/react";
import styles from "../styles/components/AuthenticateForm.module.css";
import { Button, Form } from "rsuite";
import { Trans } from "@lingui/macro";

export default function AuthenticateForm() {
  return (
    <div className={styles.wrapper}>
      <h1>
        <Trans>Login</Trans>
      </h1>
      <Form
        onSubmit={(_, e) => {
          e.preventDefault();
          const email = ((e.target as HTMLFormElement)[0] as HTMLInputElement)
            .value;
          signIn("email", { email });
        }}
      >
        <Form.Group>
          <Form.ControlLabel>
            <Trans>Email</Trans>
          </Form.ControlLabel>
          <Form.Control
            name="email"
            type="email"
            placeholder="me@example.com"
          />
        </Form.Group>
        <Form.Group>
          <Button appearance="primary" type="submit">
            <Trans>Next</Trans>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
