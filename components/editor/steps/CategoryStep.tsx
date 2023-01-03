import styles from "../../../styles/components/cap/Step.module.css";
import { classes } from "../../../lib/helpers";
import { FormAlertData, StepProps } from "../Editor";
import { Button, Form } from "rsuite";

const CATEGORIES = [
  { label: "Geophysical (e.g., landslide)", value: "Geo" },
  { label: "Meteorological (inc. flood)", value: "Met" },
  { label: "General emergency & public safety", value: "Safety" },
  {
    label: "Law enforcement, military, homeland & local/private security",
    value: "Security",
  },
  { label: "Rescue & recovery", value: "Rescue" },
  { label: "Fire supression & rescue", value: "Fire" },
  { label: "Medical & public health", value: "Health" },
  { label: "Pollution & other environmental", value: "Env" },
  { label: "Public & private transportation", value: "Transport" },
  {
    label: "Utility, telecommunication & other non-transport infrastructure",
    value: "Infra",
  },
  {
    label:
      "Chemical, Biological, Radiological, Nuclear or High-Yield Explosive threat or attack",
    value: "CBRNE",
  },
  { label: "Other", value: "Other" },
];

export default function CategoryStep({
  onUpdate,
  category,
}: Partial<FormAlertData> & StepProps) {
  return (
    <div>
      <p>Choose a category (or multiple) for the alert.</p>
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
