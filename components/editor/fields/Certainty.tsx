import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";
import { useLingui } from "@lingui/react";

export default function Certainty(props: FieldProps) {
  useLingui();
  return (
    <DropdownField
      {...props}
      label={t`Certainty`}
      options={["Observed", "Likely", "Possible", "Unlikely", "Unknown"]}
      fieldName="certainty"
    />
  );
}
