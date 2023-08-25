import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Form, Loader, Message, Toggle } from "rsuite";

import { fetcher, HandledError } from "../lib/helpers.client";
import { useToasterI18n } from "../lib/useToasterI18n";
import ErrorMessage from "./ErrorMessage";
import useSWR from "swr";

type Data = {
  defaultTimezone: string;
  severityCertaintyMatrixEnabled: boolean;
};

export default function UpdateAlertingAuthorityDetailsForm({
  alertingAuthorityId,
}: {
  alertingAuthorityId: string;
}) {
  const toaster = useToasterI18n();
  const router = useRouter();
  const {
    data: settings,
    error,
    isLoading,
  } = useSWR(
    alertingAuthorityId
      ? `/api/alertingAuthorities/${alertingAuthorityId}/settings`
      : null,
    fetcher
  );

  const [formData, setFormData] = useState<Data>();

  useEffect(() => {
    setFormData({
      defaultTimezone: settings?.defaultTimezone ?? "",
      severityCertaintyMatrixEnabled:
        settings?.severityCertaintyMatrixEnabled ?? false,
    });
  }, [settings]);

  if (isLoading) return <Loader />;
  if (error) {
    return (
      <ErrorMessage
        error={error}
        action="loading the Alerting Authority settings"
      />
    );
  }

  return (
    <div>
      <Form
        formValue={formData}
        onChange={(v) => setFormData(v as Data)}
        onSubmit={async (_, e) => {
          e.preventDefault();
          await fetch(
            `/api/alertingAuthorities/${alertingAuthorityId}/settings`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            }
          )
            .then((res) => res.json())
            .then(async (res) => {
              if (res.error) throw new HandledError(res.message);
              toaster.push(
                <Message type="success" closable>
                  <Trans>
                    Your Alerting Authority details were updated successfully
                  </Trans>
                  .
                </Message>,
                { duration: 3000 }
              );
              router.reload();
            })
            .catch((err) =>
              toaster.push(
                <ErrorMessage
                  error={err}
                  action="updating the Alerting Authority details"
                />
              )
            );
        }}
      >
        <Form.Group controlId="defaultTimezone">
          <Form.ControlLabel>
            <Trans>Default Timezone</Trans>
          </Form.ControlLabel>
          <Form.Control
            required
            name="defaultTimezone"
            placeholder={t`e.g., Europe/London`}
          />
        </Form.Group>

        <Form.Group controlId="severityCertaintyMatrixEnabled">
          <Form.ControlLabel>
            <Trans>Severity-certainity matrix enabled</Trans>
          </Form.ControlLabel>
          <Form.Control
            required
            name="severityCertaintyMatrixEnabled"
            accepter={Toggle}
          />
          <Form.HelpText>
            Control whether all members of this AA can see a 4x4
            severity-certainty matrix in the Alert Editor.
          </Form.HelpText>
        </Form.Group>

        <Form.Group>
          <Button appearance="primary" type="submit">
            <Trans>Save</Trans>
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}
