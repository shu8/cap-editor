import styles from "../../styles/components/cap/NewAlert.module.css";
import { Button, Form } from "rsuite";
import { useState } from "react";
import {
  classes,
  getEndOfYesterday,
  getStartOfToday,
  updateState,
} from "../../lib/helpers";
import HazardStep from "./steps/HazardStep";
import DataStep from "./steps/DataStep";
import TextStep from "./steps/TextStep";
import Map from "./map/Map";
import MapStep from "./steps/MapStep";
import SummaryStep from "./steps/SummaryStep";

const STEPS = ["hazard", "map", "data", "text", "summary"];
export type Step = typeof STEPS[number];

export type AlertData = {
  hazardType: string;
  regions: string[];
  from: Date;
  to: Date;
  headline: string;
  description: string;
  instruction: string;
  actions: string[];
};

export type StepProps = {
  onUpdate: (data: Partial<AlertData>) => void;
};

export default function NewAlert() {
  const [step, setStep] = useState<Step>("hazard");
  const [alertData, setAlertData] = useState<AlertData>({
    hazardType: "",
    regions: [],
    from: getStartOfToday(),
    to: getStartOfToday(),
    headline: "",
    description: "",
    instruction: "",
    actions: [],
  });

  const onUpdate = (data: Partial<AlertData>) =>
    updateState(setAlertData, data);

  const steps: {
    [step in Step]: { render: () => JSX.Element; isValid: () => boolean };
  } = {
    hazard: {
      render: () => (
        <HazardStep onUpdate={onUpdate} hazardType={alertData.hazardType} />
      ),
      isValid: () => !!alertData.hazardType,
    },
    map: {
      render: () => <MapStep onUpdate={onUpdate} regions={alertData.regions} />,
      isValid: () => alertData.regions.length > 0,
    },
    data: {
      render: () => (
        <DataStep onUpdate={onUpdate} from={alertData.from} to={alertData.to} />
      ),
      isValid: () =>
        alertData.from > getEndOfYesterday() && alertData.to > alertData.from,
    },
    text: {
      render: () => (
        <TextStep
          onUpdate={onUpdate}
          headline={alertData.headline}
          description={alertData.description}
          instruction={alertData.instruction}
          actions={alertData.actions}
        />
      ),
      isValid: () =>
        !!alertData.headline &&
        !!alertData.description &&
        !!alertData.instruction &&
        alertData.actions.length > 0,
    },
  };

  steps.summary = {
    render: () => <SummaryStep {...alertData} jumpToStep={setStep} />,
    isValid: () =>
      STEPS.filter((s) => s !== "summary").every((s) => steps[s].isValid()),
  };

  console.log("alert data", alertData);

  const currentStepIndex = STEPS.indexOf(step);
  const isStepDataValid = steps[step]?.isValid() ?? false;
  return (
    <div className={classes(styles.newAlert)}>
      <div className={classes(styles.header)}>
        <h2>New Alert</h2>

        <div className={styles.progressBar}>
          {STEPS.map((s, i) => {
            let canNavigateToThisStep = true;
            if (!isStepDataValid && i > currentStepIndex) {
              // Disable all future steps if current step is not valid
              canNavigateToThisStep = false;
            } else if (
              // Disable all steps after the next one if this one is now valid (i.e., disable >=i+1)
              isStepDataValid &&
              i > currentStepIndex + 1 &&
              !steps[STEPS[currentStepIndex + 1]]?.isValid()
            ) {
              canNavigateToThisStep = false;
            }

            return (
              <span
                key={`progress-${s}`}
                onClick={() => canNavigateToThisStep && setStep(s)}
                className={classes(
                  styles.progressItem,
                  s === step && styles.active,
                  !canNavigateToThisStep && styles.disabled
                )}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>

      <div className={styles.stepWrapper}>
        <div className={classes(styles.step)}>
          <div className={classes(styles.stepInstructions)}>
            {steps[step]?.render() ?? null}
          </div>
          <div className={classes(styles.map)}>
            <Map
              onNewPolygon={(type, coordinates) =>
                console.log(type, coordinates)
              }
              enableInteraction={step === "map"}
            />
          </div>
        </div>
      </div>

      <div className={classes(styles.footer)}>
        <Button appearance="ghost" color="red">
          Abort
        </Button>
        {step === "summary" ? (
          <Button
            appearance="primary"
            color="green"
            onClick={() => {
              setStep(STEPS[currentStepIndex + 1]);
            }}
          >
            Submit Alert
          </Button>
        ) : (
          <Button
            appearance="primary"
            color="blue"
            disabled={!isStepDataValid}
            onClick={() => {
              if (!isStepDataValid) {
                return alert("Please complete the details first");
              }
              setStep(STEPS[currentStepIndex + 1]);
            }}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
