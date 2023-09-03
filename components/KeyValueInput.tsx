import { Trans, t } from "@lingui/macro";
import { ReactNode, useEffect, useState } from "react";
import { Button, Form, Stack, Uploader } from "rsuite";
import { useToasterI18n } from "../lib/useToasterI18n";
import ErrorMessage from "./ErrorMessage";
import { HandledError } from "../lib/helpers.client";
import { useLingui } from "@lingui/react";

export default function KeyValueInput({
  keyLabel,
  valueLabel,
  emptyLabel,
  addLabel,
  onChange,
  values = {},
  disabled,
  allowImageUploadValue,
}: {
  keyLabel: ReactNode | string;
  valueLabel: ReactNode | string;
  emptyLabel: ReactNode | string;
  addLabel: ReactNode | string;
  onChange: (values: { [key: string]: string }) => void;
  values: { [key: string]: string };
  disabled?: boolean;
  allowImageUploadValue?: boolean;
}) {
  useLingui();
  const toaster = useToasterI18n();
  const [showForm, setShowForm] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleDelete = (key: string) => {
    delete values[key];
    onChange({ ...values });
  };

  useEffect(() => {
    if (values[newKey] && values[newKey] === newValue) {
      setShowForm(false);
      setNewKey("");
      setNewValue("");
    }
  }, [values, newKey, newValue]);

  return (
    <>
      <Button
        size="xs"
        onClick={() => setShowForm((old) => !old)}
        color="blue"
        disabled={disabled}
        appearance="ghost"
      >
        {showForm ? t`Cancel` : addLabel}
      </Button>

      {Object.keys(values).length !== 0 && (
        <ul>
          {Object.entries(values).map(([k, v], i) => (
            <li key={i}>
              {k}: {v} &mdash;{" "}
              <Button
                disabled={disabled}
                size="xs"
                color="red"
                appearance="ghost"
                onClick={() => handleDelete(k)}
              >
                <Trans>Delete?</Trans>
              </Button>
            </li>
          ))}
        </ul>
      )}

      {!Object.keys(values).length && !showForm && <>{emptyLabel}</>}

      {showForm && (
        <Stack spacing={10} alignItems="flex-start">
          <Form.Group controlId="key">
            <Form.ControlLabel>{keyLabel}</Form.ControlLabel>
            <Form.Control
              name="key"
              disabled={disabled}
              onChange={(v) => setNewKey(v)}
              value={newKey}
            />
          </Form.Group>
          <Form.Group controlId="value">
            <Form.ControlLabel>{valueLabel}</Form.ControlLabel>
            <Form.Control
              disabled={disabled}
              name="value"
              onChange={(v) => setNewValue(v)}
              value={newValue}
            />
            {allowImageUploadValue && (
              <Form.HelpText>
                <Uploader
                  listType="picture-text"
                  action="/api/uploadResource"
                  className="noPadding"
                  name="resourceFile"
                  accept="image/*"
                  onSuccess={(response) => {
                    if (response.error) {
                      return toaster.push(
                        <ErrorMessage
                          error={new HandledError(response.error)}
                          action={t`uploading the image`}
                        />,
                        { duration: 2000 }
                      );
                    }

                    setNewValue(response.url);
                  }}
                  onError={(reason) =>
                    toaster.push(
                      <ErrorMessage
                        error={new Error(reason.type)}
                        action={t`uploading the image`}
                      />,
                      { duration: 2000 }
                    )
                  }
                  onRemove={() => setNewValue("")}
                >
                  <Button appearance="link" size="xs" className="noPadding">
                    <Trans>Or upload an image?</Trans>
                  </Button>
                </Uploader>
              </Form.HelpText>
            )}
          </Form.Group>
          <Stack.Item alignSelf="flex-start" style={{ marginTop: "25px" }}>
            <Button
              color="blue"
              disabled={disabled}
              appearance="ghost"
              size="sm"
              onClick={() => onChange({ ...values, [newKey]: newValue })}
            >
              Save
            </Button>
          </Stack.Item>
        </Stack>
      )}
    </>
  );
}
