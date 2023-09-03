import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";
import { useLingui } from "@lingui/react";

export default function Language({ onUpdate, alertData }: FieldProps) {
  useLingui();
  return (
    <DropdownField
      onUpdate={onUpdate}
      alertData={alertData}
      options={iso6393
        .filter((l) => l.type === "living" && !!l.iso6392B)
        .map((l) => ({
          label: `${l.name} (${l.iso6392B})`,
          value: l.iso6392B,
        }))}
      searchable
      label={t`Language`}
      fieldName="language"
    />
  );
}
