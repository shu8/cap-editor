import styles from "../styles/components/AuthenticateForm.module.css";
import { Button, Form, Message } from "rsuite";
import { useEffect, useState } from "react";
import { HandledError, updateState } from "../lib/helpers.client";
import ErrorMessage from "./ErrorMessage";
import { t, Trans } from "@lingui/macro";
import { useToasterI18n } from "../lib/useToasterI18n";
import Link from "next/link";

type RegisterData = {
  name: string;
  email: string;
};

export default function RegisterForm({ email = "" }) {
  const toaster = useToasterI18n();
  const [formData, setFormData] = useState<RegisterData>({ name: "", email });

  useEffect(() => updateState(setFormData, { email }), [email]);

  return (
    <div className={styles.wrapper}>
      <h1>Register</h1>
      <Form
        formValue={formData}
        onChange={(v) => setFormData(v as RegisterData)}
        onSubmit={async (_, e) => {
          e.preventDefault();
          await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: formData.name,
              email: formData.email,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.error) throw new HandledError(res.message);
              toaster.push(
                <Message type="success" duration={0} closable>
                  <Trans>
                    Registration successful. You can now{" "}
                    <Link href="/login">login</Link>.
                  </Trans>
                </Message>
              );
            })
            .catch((err) =>
              toaster.push(<ErrorMessage error={err} action="registering" />)
            );
        }}
      >
        <Form.Group controlId="name">
          <Form.ControlLabel>
            <Trans>Name</Trans>
          </Form.ControlLabel>
          <Form.Control required name="name" placeholder={t`Your name`} />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.ControlLabel>
            <Trans>Email</Trans>
          </Form.ControlLabel>
          <Form.Control
            required
            name="email"
            type="email"
            placeholder="me@example.com"
          />
        </Form.Group>

        <Form.Group>
          <Button appearance="primary" type="submit">
            <Trans>Register</Trans>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
