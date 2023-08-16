import { t, Trans } from "@lingui/macro";
import { AlertingAuthority, AlertStatus, Role } from "@prisma/client";
import { ShareOutline } from "@rsuite/icons";
import "ol/ol.css";
import { useState } from "react";
import { Button, Divider, Form, Stack } from "rsuite";

import {
  classes,
  getEndOfYesterday,
  updateState,
} from "../../lib/helpers.client";
import { Resource } from "../../lib/types/types";
import styles from "../../styles/components/editor/EditorSinglePage.module.css";
import SplitButton from "../SplitButton";
import Map from "./map/Map";
import {
  Category,
  Certainty,
  Contact,
  Description,
  Event,
  Expires,
  Headline,
  Instruction,
  Language,
  MapForm,
  MessageType,
  Onset,
  Resources,
  ResponseType,
  Severity,
  Status,
  Timezone,
  Urgency,
  Web,
} from "./fields";

const STEPS = ["metadata", "category", "map", "data", "text", "summary"];
export type Step = typeof STEPS[number];

export type FormAlertData = {
  // Only present if an Alert is being edited (instead of created)
  identifier?: string;
  category: string[];
  regions: { [key: string]: number[] | number[][] };
  timezone?: string;
  onset: Date | string;
  expires: Date | string;
  responseType: string[];
  certainty: string;
  severity: string;
  urgency: string;
  status: string;
  msgType: string;
  references: string[];
  language: string;
  web: string;
  contact: string;
  event: string;
  headline: string;
  description: string;
  instruction: string;
  resources: Resource[];
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

export default function EditorSinglePage(props: Props) {
  const [alertData, setAlertData] = useState(props.defaultAlertData);

  const onUpdate = (data: Partial<FormAlertData>) =>
    updateState(setAlertData, data);

  const renderActionButton = () => {
    const options: AlertStatus[] = props.existingAlertStatus
      ? [props.existingAlertStatus]
      : ["DRAFT", "TEMPLATE"];

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
            CAP Alert Composer
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
      </div>

      <Form fluid className={styles.editorContainer}>
        <div className={styles.inputsWrapper}>
          <Headline onUpdate={onUpdate} alertData={alertData} />
          <Event onUpdate={onUpdate} alertData={alertData} />
          <Description onUpdate={onUpdate} alertData={alertData} />
          <Instruction onUpdate={onUpdate} alertData={alertData} />

          <Divider />

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Status onUpdate={onUpdate} alertData={alertData} />
            <MessageType onUpdate={onUpdate} alertData={alertData} />

            <Category onUpdate={onUpdate} alertData={alertData} />
            <ResponseType onUpdate={onUpdate} alertData={alertData} />
          </Stack>

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Urgency onUpdate={onUpdate} alertData={alertData} />
            <Severity onUpdate={onUpdate} alertData={alertData} />
            <Certainty onUpdate={onUpdate} alertData={alertData} />
          </Stack>

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Timezone onUpdate={onUpdate} alertData={alertData} />
            <Onset onUpdate={onUpdate} alertData={alertData} />
            <Expires onUpdate={onUpdate} alertData={alertData} />
          </Stack>

          <Divider />

          <Stack
            direction="row"
            spacing={10}
            className={styles.inputGroup}
            wrap
          >
            <Language onUpdate={onUpdate} alertData={alertData} />
            <Web onUpdate={onUpdate} alertData={alertData} />
            <Contact onUpdate={onUpdate} alertData={alertData} />
          </Stack>

          <Divider />

          <Resources onUpdate={onUpdate} alertData={alertData} />
        </div>

        <div className={classes(styles.mapFormWrapper)}>
          <MapForm
            onUpdate={onUpdate}
            alertData={alertData}
            alertingAuthority={props.alertingAuthority}
          />
        </div>
      </Form>

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
