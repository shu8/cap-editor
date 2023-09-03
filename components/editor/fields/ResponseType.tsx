import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { useLingui } from "@lingui/react";

export default function ResponseType(props: FieldProps) {
  useLingui();
  return (
    <DropdownField
      {...props}
      fieldName="responseType"
      label={t`Response`}
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
