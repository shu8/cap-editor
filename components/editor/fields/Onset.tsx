import { t } from "@lingui/macro";
import { DateTimeField, FieldProps } from "./common";
import { useLingui } from "@lingui/react";

export default function Onset(props: FieldProps) {
  useLingui();
  return <DateTimeField {...props} label={t`Onset`} fieldName="onset" />;
}
