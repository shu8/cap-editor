import { Trans, t } from "@lingui/macro";
import { FieldProps, TextField } from "./common";
import {
  UserAlertingAuthority,
  WhatNowResponse,
} from "../../../lib/types/types";
import { useToasterI18n } from "../../../lib/useToasterI18n";
import { useState } from "react";
import { HandledError, camelise } from "../../../lib/helpers.client";
import ErrorMessage from "../../ErrorMessage";
import { Button, Modal, Nav, Panel, PanelGroup } from "rsuite";

const WhatNowMessage = ({
  message,
  eventKey,
  onChosenText,
}: {
  message: WhatNowResponse;
  eventKey: number;
  onChosenText: (text: string) => void;
}) => {
  const languages = Object.keys(message.translations);
  const [chosenLanguage, setChosenLanguage] = useState(languages[0]);
  const stages = [
    "Mitigation",
    "Seasonal Forecast",
    "Warning",
    "Watch",
    "Immediate",
    "Recover",
  ];

  return (
    <Panel header={message.eventType} collapsible eventKey={eventKey} bordered>
      <Nav
        appearance="subtle"
        onSelect={setChosenLanguage}
        activeKey={chosenLanguage}
      >
        {languages.map((lang) => (
          <Nav.Item key={lang} eventKey={lang}>
            {lang}
          </Nav.Item>
        ))}
      </Nav>
      <br />

      {stages.map((stage) => {
        const text =
          message.translations[chosenLanguage].stages[camelise(stage)]?.join(
            ". "
          );
        if (!text) return;

        return (
          <details key={stage}>
            <summary>
              {stage} -{" "}
              <Button
                appearance="link"
                size="xs"
                className="noPadding"
                onClick={() => onChosenText(text)}
              >
                <Trans>Add this text?</Trans>
              </Button>
            </summary>
            <p className="displayWhiteSpace">{text}</p>
          </details>
        );
      })}
    </Panel>
  );
};

export default function Instruction({
  onUpdate,
  alertData,
  alertingAuthority,
}: FieldProps & { alertingAuthority: UserAlertingAuthority }) {
  const toaster = useToasterI18n();
  const [whatNowMessages, setWhatNowMessages] = useState<WhatNowResponse[]>([]);
  const [showWhatNowModal, setShowWhatNowModal] = useState(false);

  const handleShowWhatNow = () => {
    fetch(`/api/whatnow?countryCode=${alertingAuthority.countryCode}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        setWhatNowMessages(res.data);
        setShowWhatNowModal(true);
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage error={err} action={t`fetching WhatNow messages`} />
        )
      );
  };

  return (
    <>
      <TextField
        onUpdate={onUpdate}
        alertData={alertData}
        label={t`Instruction`}
        fieldName="instruction"
        textarea
        help={
          <Button
            className="noPadding"
            appearance="link"
            size="sm"
            onClick={handleShowWhatNow}
          >
            <Trans>Auto-fill from WhatNow?</Trans>
          </Button>
        }
      />

      <Modal
        open={showWhatNowModal}
        onClose={() => setShowWhatNowModal(false)}
        size="full"
      >
        <Modal.Header>
          <Trans>WhatNow Messages</Trans>
        </Modal.Header>

        <Modal.Body>
          <p>
            <Trans>
              You can auto-fill the alert instruction with pre-written WhatNow
              messages
            </Trans>
            .
          </p>

          <PanelGroup accordion bordered>
            {whatNowMessages.map((whatNowMessage, i) => (
              <WhatNowMessage
                key={whatNowMessage.id}
                message={whatNowMessage}
                eventKey={i}
                onChosenText={(text) => {
                  onUpdate({
                    instruction: (alertData.instruction + "\n" + text).trim(),
                  });
                }}
              />
            ))}
          </PanelGroup>
        </Modal.Body>
      </Modal>
    </>
  );
}
