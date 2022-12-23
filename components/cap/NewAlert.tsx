import styles from "../../styles/components/cap/NewAlert.module.css";
import { Button, Form } from "rsuite";
import { useState } from "react";
import {
  classes,
  getEndOfYesterday,
  getStartOfToday,
  updateState,
} from "../../lib/helpers";
import CategoryStep from "./steps/CategoryStep";
import DataStep from "./steps/DataStep";
import TextStep from "./steps/TextStep";
import Map from "./map/Map";
import MapStep from "./steps/MapStep";
import SummaryStep from "./steps/SummaryStep";
import { AlertingAuthority } from "../../lib/types/types";
import MetadataStep from "./steps/MetadataStep";

const STEPS = ["metadata", "category", "map", "data", "text", "summary"];
export type Step = typeof STEPS[number];

export type AlertData = {
  category: string;
  regions: string[];
  from: Date;
  to: Date;
  headline: string;
  description: string;
  instruction: string;
  actions: string[];
  certainty: string;
  severity: string;
  urgency: string;
  status: string;
  msgType: string;
  scope: string;
  restriction: string;
  addresses: string[];
  references: string[];
  event: string;
};

export type StepProps = {
  onUpdate: (data: Partial<AlertData>) => void;
};

export default function NewAlert({
  onSubmit,
  alertingAuthority,
}: {
  onSubmit: (alertData: AlertData) => void;
  alertingAuthority: AlertingAuthority;
}) {
  const [step, setStep] = useState<Step>(STEPS[0]);
  const [alertData, setAlertData] = useState<AlertData>({
    category: "",
    regions: [],
    from: getStartOfToday(),
    to: getStartOfToday(),
    headline: "",
    description: "",
    instruction: "",
    actions: [],
    certainty: "",
    severity: "",
    urgency: "",
    status: "",
    msgType: "",
    scope: "",
    restriction: "",
    addresses: [],
    references: [],
    event: "",
  });

  const onUpdate = (data: Partial<AlertData>) =>
    updateState(setAlertData, data);

  const steps: {
    [step in Step]: { render: () => JSX.Element; isValid: () => boolean };
  } = {
    metadata: {
      render: () => (
        <MetadataStep
          onUpdate={onUpdate}
          status={alertData.status}
          msgType={alertData.msgType}
          scope={alertData.scope}
          restriction={alertData.restriction}
          addresses={alertData.addresses}
          references={alertData.references}
        />
      ),
      isValid: () =>
        !!alertData.status &&
        !!alertData.msgType &&
        !!alertData.scope &&
        (alertData.scope !== "Private" || alertData.addresses.length > 0) &&
        (alertData.scope !== "Restricted" || !!alertData.restriction),
    },
    category: {
      render: () => (
        <CategoryStep
          onUpdate={onUpdate}
          category={alertData.category}
          event={alertData.event}
        />
      ),
      isValid: () => !!alertData.category && !!alertData.event,
    },
    map: {
      render: () => <MapStep onUpdate={onUpdate} regions={alertData.regions} />,
      isValid: () => alertData.regions.length > 0,
    },
    data: {
      render: () => (
        <DataStep
          onUpdate={onUpdate}
          from={alertData.from}
          to={alertData.to}
          certainty={alertData.certainty}
          severity={alertData.severity}
          urgency={alertData.urgency}
        />
      ),
      isValid: () =>
        alertData.from > getEndOfYesterday() &&
        alertData.to > alertData.from &&
        !!alertData.severity &&
        !!alertData.certainty &&
        !!alertData.urgency,
    },
    text: {
      render: () => (
        <TextStep
          onUpdate={onUpdate}
          headline={alertData.headline}
          event={alertData.event}
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
              alertingAuthority={alertingAuthority}
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
            onClick={() => onSubmit(alertData)}
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
