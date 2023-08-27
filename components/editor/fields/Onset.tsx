import { t } from "@lingui/macro";
import { DateTimeField, FieldProps } from "./common";

export default function Onset(props: FieldProps) {
  return <DateTimeField {...props} label={t`Onset`} fieldName="onset" />;
}
