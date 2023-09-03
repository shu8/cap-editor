import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { useLingui } from "@lingui/react";

export default function Status(props: FieldProps) {
  useLingui();
  return (
    <DropdownField
      {...props}
      label={t`Status`}
      options={["Actual", "Exercise", "System", "Test"]}
      fieldName="status"
    />
  );
}
