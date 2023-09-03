import { t } from "@lingui/macro";
import timezones from "timezones.json";
import { DropdownField, FieldProps } from "./common";
import { useLingui } from "@lingui/react";

export default function Timezone({ onUpdate, alertData }: FieldProps) {
  useLingui();
  return (
    <DropdownField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Timezone`}
      options={timezones.map((t) => ({ label: t.text, value: t.utc.at(-1) }))}
      fieldName="timezone"
      searchable
    />
  );
}
