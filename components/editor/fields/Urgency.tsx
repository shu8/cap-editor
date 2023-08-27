import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";

export default function Urgency(props: FieldProps) {
  return (
    <DropdownField
      {...props}
      label={t`Urgency`}
      options={["Immediate", "Expected", "Future", "Past", "Unknown"]}
      fieldName="urgency"
    />
  );
}
