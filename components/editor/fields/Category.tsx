import { t } from "@lingui/macro";
import { DropdownField, FieldProps } from "./common";

const CATEGORIES = [
  { label: t`Geophysical (e.g., landslide)`, value: "Geo" },
  { label: t`Meteorological (inc. flood)`, value: "Met" },
  { label: t`General emergency & public safety`, value: "Safety" },
  {
    label: t`Law enforcement, military, homeland & local/private security`,
    value: "Security",
  },
  { label: t`Rescue & recovery`, value: "Rescue" },
  { label: t`Fire supression & rescue`, value: "Fire" },
  { label: t`Medical & public health`, value: "Health" },
  { label: t`Pollution & other environmental`, value: "Env" },
  { label: t`Public & private transportation`, value: "Transport" },
  {
    label: t`Utility, telecommunication & other non-transport infrastructure`,
    value: "Infra",
  },
  {
    label: t`Chemical, Biological, Radiological, Nuclear or High-Yield Explosive threat or attack`,
    value: "CBRNE",
  },
  { label: t`Other`, value: "Other" },
];

export default function Category(props: FieldProps) {
  return (
    <DropdownField
      {...props}
      fieldName="category"
      label={t`Category`}
      options={CATEGORIES}
      multi
    />
  );
}
