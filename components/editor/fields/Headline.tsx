import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";
import { useLingui } from "@lingui/react";

export default function Headline({ onUpdate, alertData }: FieldProps) {
  useLingui();
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
