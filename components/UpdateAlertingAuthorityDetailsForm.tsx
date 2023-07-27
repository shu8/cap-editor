import { t, Trans } from "@lingui/macro";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Form, Loader, Message } from "rsuite";

import { fetcher, HandledError } from "../lib/helpers.client";
import { useToasterI18n } from "../lib/useToasterI18n";
import ErrorMessage from "./ErrorMessage";
import useSWR from "swr";

type Data = { defaultTimezone: string; contact: string; web: string };

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
      contact: settings?.contact ?? "",
      web: settings?.web ?? "",
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
                <Message type="success" duration={0} closable>
                  <Trans>
                    Your Alerting Authority details were updated successfully
                  </Trans>
                  .
                </Message>
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

        <Form.Group controlId="contact">
          <Form.ControlLabel>
            <Trans>Contact Address</Trans>
          </Form.ControlLabel>
          <Form.Control
            required
            name="contact"
            placeholder={t`e.g., metoffice@gov.uk`}
          />
        </Form.Group>

        <Form.Group controlId="web">
          <Form.ControlLabel>
            <Trans>Web URL</Trans>
          </Form.ControlLabel>
          <Form.Control
            required
            name="web"
            type="url"
            placeholder={t`e.g., www.metoffice.gov.uk`}
          />
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
