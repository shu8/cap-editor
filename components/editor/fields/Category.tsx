import { Trans, t } from "@lingui/macro";
import { CheckPicker, Form } from "rsuite";
import { FieldProps } from "./common";

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

export default function Category({ onUpdate, alertData }: FieldProps) {
  return (
    <Form.Group>
      <Form.ControlLabel>
        <Trans>Category</Trans>
      </Form.ControlLabel>
      <Form.Control
        name="category"
        accepter={CheckPicker}
        cleanable={false}
        searchable={false}
        data={CATEGORIES}
        onChange={(v) => onUpdate({ category: v })}
        value={alertData.category}
      />
    </Form.Group>
  );
}
