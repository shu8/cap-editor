import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";
import { useLingui } from "@lingui/react";

export default function Description({ onUpdate, alertData }: FieldProps) {
  useLingui();
  return (
    <TextField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Description`}
      fieldName="description"
      textarea
    />
  );
}
