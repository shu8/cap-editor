import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";

export default function ResponseType({ onUpdate, alertData }: FieldProps) {
  return (
    <DropdownField
      alertData={alertData}
      fieldName="responseType"
      label={t`Response`}
      onUpdate={onUpdate}
      options={[
        "Shelter",
        "Evacuate",
        "Prepare",
        "Execute",
        "Avoid",
        "Monitor",
        "Assess",
        "All Clear",
        "None",
      ].map((a) => ({ label: a, value: a.replace(" ", "") }))}
      multi
    />
  );
}
