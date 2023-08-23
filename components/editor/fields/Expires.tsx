import { t } from "@lingui/macro";
import { DateTimeField, FieldProps } from "./common";

export default function Expires({ onUpdate, alertData }: FieldProps) {
  return (
    <DateTimeField
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`Expires`}
      fieldName="expires"
    />
  );
}
