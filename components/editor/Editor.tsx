import { t, Trans } from "@lingui/macro";
import { AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import { ShareOutline } from "@rsuite/icons";
import "ol/ol.css";
import { useState } from "react";
import { Button } from "rsuite";

import {
  classes,
  getEndOfYesterday,
  updateState,
} from "../../lib/helpers.client";
import { Resource } from "../../lib/types/types";
import styles from "../../styles/components/editor/Editor.module.css";
import SplitButton from "../SplitButton";
import Map from "./map/Map";
import CategoryStep from "./steps/CategoryStep";
import DataStep from "./steps/DataStep";
import MapStep from "./steps/MapStep";
import MetadataStep from "./steps/MetadataStep";
import SummaryStep from "./steps/SummaryStep";
import TextStep from "./steps/TextStep";

const STEPS = ["metadata", "category", "map", "data", "text", "summary"];
export type Step = typeof STEPS[number];

export type FormAlertData = {
  // Only present if an Alert is being edited (instead of created)
  identifier?: string;
  category: string[];
  regions: { [key: string]: number[] | number[][] };
  timezone?: string;
  from: Date | string;
  to: Date | string;
  actions: string[];
  certainty: string;
  severity: string;
  urgency: string;
  status: string;
  msgType: string;
  references: string[];
  textLanguages: {
    [key: string]: {
      event: string;
      headline: string;
      description: string;
      instruction: string;
      resources: Resource[];
    };
  };
};

export type StepProps = {
  onUpdate: (data: Partial<FormAlertData>) => void;
};

type Props = {
  onSubmit: (alertData: FormAlertData, alertStatus: AlertStatus) => void;
  onCancel: () => void;
  onShareAlert: (email: string) => void;
  isShareable: boolean;
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
          references={alertData.references}
        />
      ),
      isValid: () => !!alertData.status && !!alertData.msgType,
    },
    category: {
      render: () => (
        <CategoryStep onUpdate={onUpdate} category={alertData.category} />
      ),
      isValid: () => alertData.category?.length > 0,
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
          actions={alertData.actions}
          timezone={alertData.timezone}
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
          countryCode={props.alertingAuthority.countryCode}
          urgency={alertData.urgency}
          textLanguages={alertData.textLanguages}
        />
      ),
      isValid: () =>
        Object.values(alertData.textLanguages).every(
          (l) => !!l.event && !!l.headline && !!l.description && !!l.instruction
        ),
    },
  };

  steps.summary = {
    render: () => <SummaryStep {...alertData} jumpToStep={setStep} />,
    isValid: () =>
      STEPS.filter((s) => s !== "summary").every((s) => steps[s].isValid()),
  };

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
              return alert(t`Please complete the details first`);
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
      : ["DRAFT"];

    if (props.roles.includes("APPROVER") || props.roles.includes("ADMIN")) {
      options.push("PUBLISHED");
    }

    return (
      <SplitButton
        options={options.map((o) => {
          if (o === "PUBLISHED") return t`Publish alert now`;
          return `${
            alertData.identifier ? t`Update` : t`Save as`
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
          <h2>
            {alertData.identifier ? t`Edit alert` : t`New alert`}: {step}
            {props.existingAlertStatus === "DRAFT" && props.isShareable && (
              <span
                title={t`Collaborate on this alert with someone`}
                className={styles.shareIcon}
                onClick={() => {
                  const email = window.prompt(
                    "Please enter the email address of the user you wish to invite to collaborate"
                  );
                  if (!email) return;

                  props.onShareAlert(email);
                }}
              >
                <ShareOutline />
              </span>
            )}
          </h2>
          {alertData.identifier && (
            <>
              <Trans>Alert ID</Trans>:{" "}
              <span className={styles.alertId}>{alertData.identifier}</span>
            </>
          )}
        </div>

        <div className={styles.progressBar}>
          {STEPS.map((s, i) => {
            let canNavigateToThisStep = i <= earliestInvalidStepIndex;

            return (
              <span
                key={`progress-${s}`}
                onClick={() => canNavigateToThisStep && setStep(s)}
                aria-disabled={!canNavigateToThisStep}
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
        <Button
          appearance="ghost"
          color="red"
          onClick={() => {
            if (
              window.confirm(
                t`Are you sure you want to cancel editing this alert?`
              )
            ) {
              props.onCancel();
            }
          }}
        >
          <Trans>Cancel</Trans>
        </Button>

        {renderActionButton()}
      </div>
    </div>
  );
}
