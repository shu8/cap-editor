import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";

export default function Contact({ onUpdate, alertData }: FieldProps) {
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Contact`}
      fieldName="contact"
    />
  );
}
