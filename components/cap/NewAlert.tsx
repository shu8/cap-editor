import styles from "../../styles/components/cap/NewAlert.module.css";
import { Button, Form } from "rsuite";
import { useState } from "react";
import { classes } from "../../lib/helpers";
import HazardStep from "./steps/HazardStep";
import DataStep from "./steps/DataStep";
import TextStep from "./steps/TextStep";
import Map from "./map/Map";

const STEPS = ["hazard", "map", "data", "text", "summary"];
type Step = typeof STEPS[number];

export default function NewAlert() {
  const [step, setStep] = useState<Step>("hazard");
  const [alertData, setAlertData] = useState({});

  const renderStep = () => {
    if (step === "hazard") {
      return <HazardStep />;
    }
    if (step === "map") {
      return "map";
    }
    if (step === "data") {
      return <DataStep />;
    }
    if (step === "text") {
      return <TextStep />;
    }
    if (step === "summary") {
      return "summray";
    }
  };
  return (
    <div className={classes(styles.newAlert)}>
      <div className={classes(styles.header)}>
        <h2>New Alert</h2>

        <div className={styles.progressBar}>
          {STEPS.map((s) => (
            <span
              onClick={() => setStep(s)}
              key={`progress-${s}`}
              className={classes(
                styles.progressItem,
                s === step && styles.active
              )}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className={styles.stepWrapper}>
        <div className={classes(styles.step)}>
          <div className={classes(styles.stepInstructions)}>{renderStep()}</div>
          <div className={classes(styles.map)}>
            <Map
              onNewPolygon={(type, coordinates) =>
                console.log(type, coordinates)
              }
            />
          </div>
        </div>
      </div>

      <div className={classes(styles.footer)}>
        <Button appearance="ghost" color="red">
          Abort
        </Button>
        <Button appearance="primary" color="blue">
          Next
        </Button>
      </div>
    </div>
  );
}
