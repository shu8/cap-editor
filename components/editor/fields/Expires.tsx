import { t } from "@lingui/macro";
import { DateTimeField, FieldProps } from "./common";
import { useLingui } from "@lingui/react";

export default function Expires(props: FieldProps) {
  useLingui();
  return <DateTimeField {...props} label={t`Expires`} fieldName="expires" />;
}
