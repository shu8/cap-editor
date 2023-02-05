import { Button, Form, Loader, Message, SelectPicker } from "rsuite";
import { useEffect, useState } from "react";
import { HandledError, updateState } from "../lib/helpers.client";
import ErrorMessage from "./ErrorMessage";
import { t, Trans } from "@lingui/macro";
import { useToasterI18n } from "../lib/useToasterI18n";

type RegisterData = {
  alertingAuthorityId: string;
};

export default function ConnectToAlertingAuthorityForm({ email = "" }) {
  const toaster = useToasterI18n();
  const [alertingAuthorities, setAlertingAuthorities] = useState([]);
  const [formData, setFormData] = useState<RegisterData>({
    alertingAuthorityId: "",
  });

  useEffect(() => updateState(setFormData, { email }), [email]);

  // TODO fix styling of select items (height of virtualised cells)
  return (
    <div>
      <Form
        formValue={formData}
        onChange={(v) => setFormData(v as RegisterData)}
        onSubmit={async (_, e) => {
          e.preventDefault();
          await fetch("/api/user/alertingAuthorities", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              alertingAuthorityId: formData.alertingAuthorityId,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.error) throw new HandledError(res.message);
              toaster.push(
                <Message type="success" duration={0} closable>
                  <Trans>
                    Your request has been sent to your Alerting Authority; you
                    will receive an email once they have approved your access.
                  </Trans>
                </Message>
              );
            })
            .catch((err) =>
              toaster.push(<ErrorMessage error={err} action="registering" />)
            );
        }}
      >
        <Form.Group controlId="alertingAuthorityId">
          <Form.ControlLabel>
            <p>
              <Trans>
                Please use the form below to connect to Alerting Authorities
                that you are part of. Your request will be sent to your Alerting
                Authority for approval.
              </Trans>
            </p>
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
            renderMenu={(menu) => {
              if (alertingAuthorities.length === 0) {
                return <Loader style={{ margin: "auto", padding: "10px" }} />;
              }
              return menu;
            }}
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
            <Trans>Connect to Alerting Authority</Trans>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
