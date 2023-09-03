import { t } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { DropdownField, FieldProps } from "./common";

export default function Urgency(props: FieldProps) {
  useLingui()
  return (
    <DropdownField
      {...props}
      label={t`Urgency`}
      options={["Immediate", "Expected", "Future", "Past", "Unknown"]}
      fieldName="urgency"
    />
  );
}
