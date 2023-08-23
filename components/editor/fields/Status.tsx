import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";

export default function Status({ onUpdate, alertData }: FieldProps) {
  return (
    <DropdownField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Status`}
      options={["Actual", "Exercise", "System", "Test"]}
      fieldName="status"
    />
  );
}
