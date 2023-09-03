import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { DropdownField, FieldProps } from "./common";

export default function Severity(props: FieldProps) {
  useLingui();
  return (
    <DropdownField
      {...props}
      label={t`Severity`}
      options={["Extreme", "Severe", "Moderate", "Minor", "Unknown"]}
      fieldName="severity"
    />
  );
}
