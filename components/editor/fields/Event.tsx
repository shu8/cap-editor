import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";
import { useLingui } from "@lingui/react";

export default function Event({ onUpdate, alertData }: FieldProps) {
  useLingui();
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Event`}
      fieldName="event"
      help={t`What is the event this alert pertains to?`}
      maxLength={35}
    />
  );
}
