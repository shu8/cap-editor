import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";
import { useLingui } from "@lingui/react";

export default function Contact({ onUpdate, alertData }: FieldProps) {
  useLingui();
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Contact`}
      fieldName="contact"
    />
  );
}
