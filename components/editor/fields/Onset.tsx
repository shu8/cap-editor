import { t } from "@lingui/macro";
import { DateTimeField, FieldProps } from "./common";

export default function Onset({ onUpdate, alertData }: FieldProps) {
  return (
    <DateTimeField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Onset`}
      fieldName="onset"
    />
  );
}
