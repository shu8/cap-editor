import { t } from "@lingui/macro";
import { DateTimeField, FieldProps } from "./common";

export default function Expires(props: FieldProps) {
  return <DateTimeField {...props} label={t`Expires`} fieldName="expires" />;
}
