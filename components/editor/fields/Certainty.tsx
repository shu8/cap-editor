import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";

export default function Certainty({ onUpdate, alertData }: FieldProps) {
  return (
    <DropdownField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Certainty`}
      options={["Observed", "Likely", "Possible", "Unlikely", "Unknown"]}
      fieldName="certainty"
    />
  );
}
