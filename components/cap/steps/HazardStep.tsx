import styles from "../../../styles/components/cap/Step.module.css";
import { classes } from "../../../lib/helpers";
import { AlertData, StepProps } from "../NewAlert";
import { Button } from "rsuite";

const HAZARD_TYPES = ["Hurricane", "Earthquake", "Flooding", "Other"];
export default function HazardStep({
  onUpdate,
  hazardType,
}: Partial<AlertData> & StepProps) {
  return (
    <div>
      <h4>Hazard Type</h4>
      <p>Choose a hazard type for the alert.</p>
      <div className={classes(styles.buttonGrid)}>
        {HAZARD_TYPES.map((hazard) => (
          <Button
            key={`hazard-${hazard}`}
            onClick={() => onUpdate({ hazardType: hazard })}
            active={hazardType === hazard}
            appearance="subtle"
            style={{ border: "1px solid red" }}
            color="red"
          >
            {hazard}
          </Button>
        ))}
      </div>
    </div>
  );
}
