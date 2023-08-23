import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";
import { iso6393 } from "iso-639-3";

export default function MessageType({ onUpdate, alertData }: FieldProps) {
  return (
    <DropdownField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Type`}
      options={["Alert", "Update", "Cancel"]}
      fieldName="msgType"
    />
  );
}
