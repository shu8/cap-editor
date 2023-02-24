import { t, Trans } from "@lingui/macro";
import ISO6391 from "iso-639-1";
import { forwardRef, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Form,
  Input,
  Message,
  SelectPicker,
} from "rsuite";

import {
  camelise,
  HandledError,
  useMountEffect,
} from "../../../lib/helpers.client";
import { Resource, WhatNowResponse } from "../../../lib/types/types";
import { useToasterI18n } from "../../../lib/useToasterI18n";
import styles from "../../../styles/components/editor/Step.module.css";
import ErrorMessage from "../../ErrorMessage";
import { FormAlertData, StepProps } from "../Editor";
import LanguageTabs from "../LanguageTabs";
import ResourceModal from "../ResourceModal";

const Textarea = forwardRef((props, ref) => (
  <Input {...props} ref={ref} rows={5} as="textarea" />
));
Textarea.displayName = "Textarea";

const getDefaultInstructionTypes = (urgency: string) => {
  const types = [];

  if (urgency === "Immediate") types.push("immediate");
  if (urgency === "Expected") types.push("watch");
  if (urgency === "Future") types.push("warning", "seasonalForecast");

  return types;
};

const ResourceItem = ({
  resource,
  onDelete,
}: {
  resource: Resource;
  onDelete: () => void;
}) => {
  return (
    <li className={styles.resource}>
      {resource.resourceDesc} (
      <a href={resource.uri} target="_blank" rel="noreferrer">
        {resource.uri}
      </a>
      ) &mdash;{" "}
      <Button size="xs" color="red" appearance="ghost" onClick={onDelete}>
        <Trans>Delete?</Trans>
      </Button>
    </li>
  );
};

export default function TextStep({
  onUpdate,
  countryCode,
  urgency,
  textLanguages,
}: Partial<FormAlertData> & StepProps & { countryCode: string }) {
  const toaster = useToasterI18n();
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [language, setLanguage] = useState(Object.keys(textLanguages!)[0]);
  const [whatNowMessages, setWhatNowMessages] = useState<WhatNowResponse[]>([]);
  const [chosenWhatNowMessage, setChosenWhatNowMessage] = useState<
    string | null
  >(null);
  const [chosenWhatNowInstructions, setChosenWhatNowInstructions] = useState(
    getDefaultInstructionTypes(urgency!)
  );

  const updateField = (field, value) => {
    textLanguages![language][field] = value;
    onUpdate({ textLanguages: { ...textLanguages } });
  };

  useMountEffect(() => {
    fetch(`/api/whatnow?countryCode=${countryCode}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        setWhatNowMessages(res.data);
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage error={err} action={t`fetching WhatNow messages`} />
        )
      );
  });

  useEffect(() => {
    if (chosenWhatNowMessage == null) return;

    const message = whatNowMessages.find((w) => w.id === chosenWhatNowMessage);
    if (!message) return;

    updateField("description", message.translations[language].description);
    updateField(
      "instruction",
      Object.entries(message.translations[language].stages)
        .filter(
          ([type, strings]) =>
            chosenWhatNowInstructions.includes(type) && strings.length
        )
        .map(([type, strings], i) => `- ${strings.join("\n- ")}`)
        .join("\n\n")
    );
  }, [chosenWhatNowMessage, chosenWhatNowInstructions]);

  useEffect(() => {
    // Handle a language being deleted
    const languages = Object.keys(textLanguages!);
    if (languages.indexOf(language) === -1) {
      setLanguage(languages[0]);
    }
  }, [textLanguages]);

  const whatNowMessagesInCurrentLanguage =
    whatNowMessages?.filter((m) => !!m.translations[language]) ?? [];

  console.log(language);
  const { event, headline, description, instruction, resources } =
    textLanguages![language] ?? {};
  return (
    <div>
      <LanguageTabs
        languages={Object.keys(textLanguages!)}
        language={language}
        onDeleteLanguage={(l) => {
          if (Object.keys(textLanguages).length > 1) {
            delete textLanguages![l];
            onUpdate({ textLanguages: { ...textLanguages } });
          } else {
            toaster.push(
              <Message type="error" duration={0} closable>
                <Trans>
                  You cannot delete all languages. Please select a new language
                  to keep first
                </Trans>
              </Message>
            );
          }
        }}
        onCreateLanguage={(l) => {
          onUpdate({
            textLanguages: {
              ...textLanguages,
              [l]: {
                event: "",
                headline: "",
                description: "",
                instruction: "",
                resources: [],
              },
            },
          });
          setLanguage(l);
        }}
        onSetLanguage={(l) => setLanguage(l)}
      >
        <Form fluid>
          <Form.Group>
            <Form.ControlLabel>
              <Trans>What is the event this alert pertains to?</Trans>
            </Form.ControlLabel>
            <Form.Control
              name="event"
              onChange={(v) => updateField("event", v)}
              value={event}
            />
            <Form.HelpText
              style={{ color: (event?.length ?? 0) > 15 ? "red" : "unset" }}
            >
              {event?.length ?? 0}/15 <Trans>characters</Trans>
            </Form.HelpText>
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>
              <Trans>Headline</Trans>
            </Form.ControlLabel>
            <Form.Control
              name="headline"
              onChange={(v) => updateField("headline", v)}
              value={headline}
            />
            <Form.HelpText
              style={{ color: (headline?.length ?? 0) > 160 ? "red" : "unset" }}
            >
              {headline?.length ?? 0}/160 <Trans>characters</Trans>
            </Form.HelpText>
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>
              <Trans>Description</Trans>
            </Form.ControlLabel>
            {!!whatNowMessagesInCurrentLanguage.length && (
              <SelectPicker
                block
                placeholder={t`Choose event to auto-fill from WhatNow?`}
                data={whatNowMessages.map((w) => ({
                  label: w.eventType,
                  value: w.id,
                }))}
                onChange={(v) => setChosenWhatNowMessage(v)}
              />
            )}
            <Form.Control
              accepter={Textarea}
              name="description"
              onChange={(v) => updateField("description", v)}
              value={description}
            />
            {!!whatNowMessagesInCurrentLanguage.length && (
              <Form.HelpText>
                <Trans>
                  WhatNow provides pre-written messages and instructions you can
                  use for certain events. Use the dropdown to select one of
                  these as a template, or provide your own Description and
                  Instructions.
                </Trans>
              </Form.HelpText>
            )}
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Instruction</Form.ControlLabel>
            {!!whatNowMessagesInCurrentLanguage.length &&
              chosenWhatNowMessage && (
                <CheckboxGroup
                  inline
                  onChange={(v) => setChosenWhatNowInstructions(v as string[])}
                  value={chosenWhatNowInstructions}
                >
                  {[
                    "Mitigation",
                    "Seasonal Forecast",
                    "Warning",
                    "Watch",
                    "Immediate",
                    "Recover",
                  ].map((t) => (
                    <Checkbox key={`instruction-type-${t}`} value={camelise(t)}>
                      {t}
                    </Checkbox>
                  ))}
                </CheckboxGroup>
              )}
            <Form.Control
              accepter={Textarea}
              name="instruction"
              onChange={(v) => updateField("instruction", v)}
              value={instruction}
            />
          </Form.Group>
        </Form>

        <h4>
          <Trans>Link to external resources</Trans>
        </h4>
        <p>
          <Trans>
            If necessary, add links to resources (in {ISO6391.getName(language)}
            ) that offer complementary, non-essential information to the alert.
          </Trans>
        </p>
        {showResourceModal && (
          <ResourceModal
            language={ISO6391.getName(language)}
            onSubmit={(d) => {
              if (!d?.resourceDesc || !d?.uri) {
                return setShowResourceModal(false);
              }
              resources!.push(d);
              updateField("resources", [...resources]);
              setShowResourceModal(false);
            }}
          />
        )}

        {resources?.map((r, i) => (
          <ResourceItem
            resource={r}
            key={`resource=${i}`}
            onDelete={() => {
              resources.splice(i, 1);
              updateField("resources", [...resources]);
            }}
          />
        ))}

        <Button onClick={() => setShowResourceModal(true)}>Add URL?</Button>
      </LanguageTabs>
    </div>
  );
}
