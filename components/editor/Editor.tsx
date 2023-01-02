import "ol/ol.css";
import styles from "../../styles/components/cap/NewAlert.module.css";
import { Button } from "rsuite";
import { useState } from "react";
import { classes, getEndOfYesterday, updateState } from "../../lib/helpers";
import CategoryStep from "./steps/CategoryStep";
import DataStep from "./steps/DataStep";
import TextStep from "./steps/TextStep";
import Map from "./map/Map";
import MapStep from "./steps/MapStep";
import SummaryStep from "./steps/SummaryStep";
import MetadataStep from "./steps/MetadataStep";
import { AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import SplitButton from "../SplitButton";

const STEPS = ["metadata", "category", "map", "data", "text", "summary"];
export type Step = typeof STEPS[number];

export type FormAlertData = {
  // Only present if an Alert is being edited (instead of created)
  identifier?: string;
  category: string[];
  regions: { [key: string]: number[] };
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
  onUpdate: (data: Partial<FormAlertData>) => void;
};

type Props = {
  onSubmit: (alertData: FormAlertData, alertStatus: AlertStatus) => void;
  defaultAlertData: FormAlertData;
  alertingAuthority: AlertingAuthority;
  roles: Role[];
  existingAlertStatus?: AlertStatus;
};

export default function Editor(props: Props) {
  const [step, setStep] = useState<Step>(STEPS[0]);
  const [alertData, setAlertData] = useState(props.defaultAlertData);

  const onUpdate = (data: Partial<FormAlertData>) =>
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
      isValid: () => alertData.category?.length > 0 && !!alertData.event,
    },
    map: {
      render: () => (
        <MapStep
          onUpdate={onUpdate}
          regions={{ ...alertData.regions }}
          countryCode={props.alertingAuthority.countryCode}
        />
      ),
      isValid: () =>
        Object.keys(alertData.regions).length > 0 &&
        Object.values(alertData.regions).every(
          (r) => Array.isArray(r) && r.length > 0
        ),
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
          countryCode={props.alertingAuthority.countryCode}
          urgency={alertData.urgency}
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
  let earliestInvalidStepIndex = STEPS.length;
  for (let i = 0; i < STEPS.length; i++) {
    if (!steps[STEPS[i]].isValid()) {
      earliestInvalidStepIndex = i;
      break;
    }
  }

  const renderActionButton = () => {
    if (step !== "summary") {
      return (
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
      );
    }

    const options: AlertStatus[] = props.existingAlertStatus
      ? [props.existingAlertStatus]
      : ["DRAFT", "TEMPLATE"];

    if (
      !alertData.identifier &&
      (props.roles.includes("VALIDATOR") || props.roles.includes("ADMIN"))
    ) {
      options.push("PUBLISHED");
    }

    return (
      <SplitButton
        options={options.map((o) => {
          if (o === "PUBLISHED") return "Publish alert now";
          return `${
            alertData.identifier ? "Update" : "Save as"
          } ${o.toLowerCase()}`;
        })}
        appearance="primary"
        color="green"
        onClick={(optionIndex) =>
          props.onSubmit(alertData, options[optionIndex])
        }
      />
    );
  };

  return (
    <div className={classes(styles.newAlert)}>
      <div className={classes(styles.header)}>
        <div>
          <h3>
            {alertData.identifier ? "Edit alert" : "New alert"}: {step}
          </h3>
          {alertData.identifier && (
            <span>Alert ID: {alertData.identifier}</span>
          )}
        </div>

        <div className={styles.progressBar}>
          {STEPS.map((s, i) => {
            let canNavigateToThisStep = i <= earliestInvalidStepIndex;

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
              onRegionsChange={(regions) => onUpdate({ regions })}
              regions={alertData.regions}
              alertingAuthority={props.alertingAuthority}
              enableInteraction={step === "map"}
            />
          </div>
        </div>
      </div>

      <div className={classes(styles.footer)}>
        <Button appearance="ghost" color="red">
          Abort
        </Button>

        {renderActionButton()}
      </div>
    </div>
  );
}
