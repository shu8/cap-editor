import styles from "../../../styles/components/cap/Step.module.css";
import { classes } from "../../../lib/helpers";
import { AlertData, StepProps } from "../NewAlert";
import { Button } from "rsuite";

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
}: Partial<AlertData> & StepProps) {
  return (
    <div>
      <h4>Category</h4>
      <p>Choose a category for the alert.</p>
      <div className={classes(styles.buttonGrid)}>
        {CATEGORIES.map((c) => (
          <Button
            className={classes(styles.button)}
            key={`cat-${c.value}`}
            onClick={() => onUpdate({ category: c.value })}
            active={category === c.value}
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
