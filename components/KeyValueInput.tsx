import { Trans, t } from "@lingui/macro";
import { ReactNode, useEffect, useState } from "react";
import { Button, Form, Stack } from "rsuite";

export default function KeyValueInput({
  keyLabel,
  valueLabel,
  emptyLabel,
  addLabel,
  onChange,
  values = {},
}: {
  keyLabel: ReactNode | string;
  valueLabel: ReactNode | string;
  emptyLabel: ReactNode | string;
  addLabel: ReactNode | string;
  onChange: (values: { [key: string]: string }) => void;
  values: { [key: string]: string };
}) {
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
        <Stack spacing={10} alignItems="flex-end">
          <Form.Group>
            <Form.ControlLabel>{keyLabel}</Form.ControlLabel>
            <Form.Control
              name="key"
              onChange={(v) => setNewKey(v)}
              value={newKey}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>{valueLabel}</Form.ControlLabel>
            <Form.Control
              name="value"
              onChange={(v) => setNewValue(v)}
              value={newValue}
            />
          </Form.Group>
          <Button
            color="blue"
            appearance="ghost"
            size="sm"
            onClick={() => onChange({ ...values, [newKey]: newValue })}
          >
            Save
          </Button>
        </Stack>
      )}
    </>
  );
}
