import { t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";

export default function Description({ onUpdate, alertData }: FieldProps) {
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
