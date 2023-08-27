import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";

export default function Severity(props: FieldProps) {
  return (
    <DropdownField
      {...props}
      label={t`Severity`}
      options={["Extreme", "Severe", "Moderate", "Minor", "Unknown"]}
      fieldName="severity"
    />
  );
}
