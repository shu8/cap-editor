import styles from "../styles/components/AuthenticateForm.module.css";
import { Button, Form, Message, SelectPicker } from "rsuite";
import { useEffect, useState } from "react";
import { HandledError, updateState } from "../lib/helpers.client";
import ErrorMessage from "./ErrorMessage";
import { t, Trans } from "@lingui/macro";
import { useToasterI18n } from "../lib/useToasterI18n";

type RegisterData = {
  name: string;
  email: string;
  alertingAuthorityId: string;
};

export default function RegisterForm({ email = "" }) {
  const toaster = useToasterI18n();
  const [alertingAuthorities, setAlertingAuthorities] = useState([]);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email,
    alertingAuthorityId: "",
  });

  useEffect(() => updateState(setFormData, { email }), [email]);

  // TODO fix styling of select items (height of virtualised cells)
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
              alertingAuthorityId: formData.alertingAuthorityId,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.error) throw new HandledError(res.message);
              toaster.push(
                <Message type="success" duration={0} closable>
                  <Trans>
                    Registration successful. You will receive an email once your
                    Alerting Authority has approved your account.
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

        <Form.Group controlId="alertingAuthorityId">
          <Form.ControlLabel>
            <Trans>Alerting Authority</Trans>
          </Form.ControlLabel>
          <Form.Control
            style={{ width: "400px" }}
            name="alertingAuthorityId"
            accepter={SelectPicker}
            onOpen={() =>
              fetch("/api/alertingAuthorities")
                .then((res) => res.json())
                .then((res) => {
                  if (res.error) throw new HandledError(res.message);
                  return setAlertingAuthorities(res.result);
                })
                .catch((err) =>
                  toaster.push(
                    <ErrorMessage
                      error={err}
                      action={t`fetching alerting authorities`}
                    />
                  )
                )
            }
            virtualized
            groupBy="countryCode"
            labelKey="name"
            valueKey="id"
            sort={(isGroup) => {
              return (a, b) =>
                (isGroup ? a.groupTitle > b.groupTitle : a.name > b.name)
                  ? 1
                  : -1;
            }}
            data={alertingAuthorities}
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
