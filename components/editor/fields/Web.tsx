import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";

export default function Web({ onUpdate, alertData }: FieldProps) {
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Web`}
      fieldName="web"
    />
  );
}
