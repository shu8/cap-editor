import { t, Trans } from "@lingui/macro";
import { Button } from "rsuite";

import { classes } from "../../../lib/helpers.client";
import styles from "../../../styles/components/editor/Step.module.css";
import { FormAlertData, StepProps } from "../Editor";

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

export default function CategoryStep({
  onUpdate,
  category,
}: Partial<FormAlertData> & StepProps) {
  return (
    <div>
      <p>
        <Trans>Choose a category (or multiple) for the alert.</Trans>
      </p>
      <div className={classes(styles.buttonGrid)}>
        {CATEGORIES.map((c) => (
          <Button
            className={classes(styles.button)}
            key={`cat-${c.value}`}
            onClick={() => {
              const index = category?.indexOf(c.value) ?? -1;
              if (index > -1) {
                category?.splice(index, 1);
              } else {
                category?.push(c.value);
              }
              return onUpdate({ category: category });
            }}
            active={category?.includes(c.value)}
            appearance="subtle"
            color="red"
          >
            {c.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
