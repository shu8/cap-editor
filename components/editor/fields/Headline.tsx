import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";

export default function Headline({ onUpdate, alertData }: FieldProps) {
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Headline`}
      fieldName="headline"
      maxLength={140}
    />
  );
}
