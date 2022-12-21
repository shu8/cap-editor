import styles from "../../../styles/components/cap/Step.module.css";
import { useState } from "react";
import { classes } from "../../../lib/helpers";

const HAZARD_TYPES = ["Hurricane", "Earthquake", "Flooding"];

export default function HazardStep({ onNext }) {
  const [hazardData, setHazardData] = useState({});

  return (
    <div>
      <h4>Hazard Type</h4>
      <p>Choose a hazard type for the alert.</p>
      <div className={classes(styles.buttonGrid)}>
        {HAZARD_TYPES.map((h) => (
          <div className={classes(styles.button)} key={`hazard-${h}`}>
            {h}
          </div>
        ))}
        <div className={classes(styles.button)}>Other</div>
      </div>
    </div>
  );
}
