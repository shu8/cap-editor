import { Trans, t } from "@lingui/macro";
import {
  Button,
  CheckPicker,
  DatePicker,
  Form,
  Input,
  Message,
  SelectPicker,
  Stack,
} from "rsuite";
import { FormAlertData } from "./EditorSinglePage";
import timezones from "timezones.json";
import { iso6393 } from "iso-639-3";
import React, { useState } from "react";
import { HandledError } from "../../lib/helpers.client";
import { useToasterI18n } from "../../lib/useToasterI18n";

type Props = {
  onUpdate: (data: Partial<FormAlertData>) => void;
  alertData: FormAlertData;
};

const CATEGORIES = [
  { label: t`Geophysical (e.g., landslide)`, value: "Geo" },
  { label: t`Meteorological (inc. flood)`, value: "Met" },
  { label: t`General emergency & public safety`, value: "Safety" },
  {
    label: t`Law enforcement, military, homeland & local/private security`,
    value: "Security",
  },
  { label: t`Rescue & recovery`, value: "Rescue" },
  { label: t`Fire supression & rescue`, value: "Fire" },
  { label: t`Medical & public health`, value: "Health" },
  { label: t`Pollution & other environmental`, value: "Env" },
  { label: t`Public & private transportation`, value: "Transport" },
  {
    label: t`Utility, telecommunication & other non-transport infrastructure`,
    value: "Infra",
  },
  {
    label: t`Chemical, Biological, Radiological, Nuclear or High-Yield Explosive threat or attack`,
    value: "CBRNE",
  },
  { label: t`Other`, value: "Other" },
];

const Textarea = React.forwardRef((props, ref) => (
  <Input {...props} as="textarea" ref={ref} />
));
Textarea.displayName = "Textarea";

const TextField = ({
  onUpdate,
  alertData,
  label,
  fieldName,
  maxLength,
  textarea,
  help,
}: {
  label: string;
  fieldName: keyof FormAlertData;
  maxLength?: number;
  textarea?: boolean;
  help?: string;
} & Props) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      onChange={(v) => onUpdate({ [fieldName]: v })}
      value={alertData[fieldName]}
      accepter={textarea ? Textarea : Input}
    />
    {!!maxLength && (
      <Form.HelpText
        style={{
          color:
            (alertData[fieldName]?.length ?? 0) > maxLength ? "red" : "unset",
        }}
      >
        {alertData[fieldName]?.length ?? 0}/{maxLength}{" "}
        <Trans>characters</Trans>
      </Form.HelpText>
    )}
    {!!help && <Form.HelpText>{help}</Form.HelpText>}
  </Form.Group>
);

const DropdownField = ({
  onUpdate,
  alertData,
  label,
  options,
  fieldName,
  searchable,
}: {
  label: string;
  fieldName: keyof FormAlertData;
  options: string[] | { label: string; value: any }[];
  searchable?: boolean;
} & Props) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      accepter={SelectPicker}
      data={
        typeof options[0] === "string"
          ? options.map((t) => ({
              label: t,
              value: t,
            }))
          : options
      }
      block
      cleanable={false}
      searchable={searchable ?? false}
      value={alertData[fieldName]}
      onChange={(v) => onUpdate({ [fieldName]: v! })}
    />
  </Form.Group>
);

const DateTimeField = ({
  onUpdate,
  alertData,
  label,
  fieldName,
}: {
  label: string;
  fieldName: keyof FormAlertData;
} & Props) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      accepter={DatePicker}
      oneTap
      format="yyyy-MM-dd HH:mm:ss"
      block
      cleanable={false}
      value={alertData[fieldName] as Date}
      onChange={(v) => onUpdate({ [fieldName]: v! })}
    />
  </Form.Group>
);

export const Headline = ({ onUpdate, alertData }: Props) => (
  <TextField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Headline`}
    fieldName="headline"
    maxLength={15}
  />
);

export const Event = ({ onUpdate, alertData }: Props) => (
  <TextField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Event`}
    fieldName="event"
    help={t`What is the event this alert pertains to?`}
  />
);

export const Description = ({ onUpdate, alertData }: Props) => (
  <TextField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Description`}
    fieldName="description"
    textarea
  />
);

export const Instruction = ({ onUpdate, alertData }: Props) => (
  <TextField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Instruction`}
    fieldName="instruction"
    textarea
  />
);

export const Web = ({ onUpdate, alertData }: Props) => (
  <TextField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Web`}
    fieldName="web"
  />
);

export const Contact = ({ onUpdate, alertData }: Props) => (
  <TextField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Contact`}
    fieldName="contact"
  />
);

export const Language = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    options={iso6393
      .filter((l) => l.type === "living" && !!l.iso6392B)
      .map((l) => ({
        label: `${l.name} (${l.iso6392B})`,
        value: l.iso6392B,
      }))}
    searchable
    label={t`Language`}
    fieldName="language"
  />
);

export const Urgency = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Urgency`}
    options={["Immediate", "Expected", "Future"]}
    fieldName="urgency"
  />
);

export const Certainty = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Certainty`}
    options={["Likely", "Possible", "Unlikely"]}
    fieldName="certainty"
  />
);

export const Severity = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Severity`}
    options={["Minor", "Moderate", "Severe"]}
    fieldName="severity"
  />
);

export const Status = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Status`}
    options={["Actual", "Exercise", "System", "Test"]}
    fieldName="status"
  />
);

export const MessageType = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Type`}
    options={["Alert", "Update", "Cancel"]}
    fieldName="msgType"
  />
);

export const Onset = ({ onUpdate, alertData }: Props) => (
  <DateTimeField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Onset`}
    fieldName="onset"
  />
);

export const Expires = ({ onUpdate, alertData }: Props) => (
  <DateTimeField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Expires`}
    fieldName="expires"
  />
);

export const Timezone = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Timezone`}
    options={timezones.map((t) => ({ label: t.text, value: t.utc.at(-1) }))}
    fieldName="timezone"
  />
);

export const ResponseType = ({ onUpdate, alertData }: Props) => (
  <Form.Group>
    <Form.ControlLabel>
      <Trans>Response</Trans>
    </Form.ControlLabel>
    <Form.Control
      name="category"
      accepter={CheckPicker}
      cleanable={false}
      searchable={false}
      data={[
        "Shelter",
        "Evacuate",
        "Prepare",
        "Execute",
        "Avoid",
        "Monitor",
        "Assess",
        "All Clear",
        "None",
      ].map((a) => ({ label: a, value: a.replace(" ", "") }))}
      onChange={(v) => onUpdate({ responseType: v })}
      value={alertData.responseType}
    />
  </Form.Group>
);

export const Category = ({ onUpdate, alertData }: Props) => (
  <Form.Group>
    <Form.ControlLabel>
      <Trans>Category</Trans>
    </Form.ControlLabel>
    <Form.Control
      name="category"
      accepter={CheckPicker}
      cleanable={false}
      searchable={false}
      data={CATEGORIES}
      onChange={(v) => onUpdate({ category: v })}
      value={alertData.category}
    />
  </Form.Group>
);

export const Resources = ({ onUpdate, alertData }: Props) => {
  const toaster = useToasterI18n();
  const [addNewResource, setAddNewResource] = useState(false);
  const [newResourceUrl, setNewResourceUrl] = useState("");
  const [newResourceDesc, setNewResourceDesc] = useState("");

  const getMimeType = async (url: string): Promise<string> => {
    try {
      const res = await fetch("/api/mime?" + new URLSearchParams({ url })).then(
        (res) => res.json()
      );
      if (res.error) throw new HandledError(res.message);
      return res.mime;
    } catch {
      throw new HandledError(
        t`There was an error accessing this resource. It may be currently unavailable.`
      );
    }
  };

  const handleSave = async () => {
    try {
      const mimeType = await getMimeType(newResourceUrl);
      const resources = [...alertData.resources];
      resources.push({
        resourceDesc: newResourceDesc,
        uri: newResourceUrl,
        mimeType,
      });
      onUpdate({ resources });
      setNewResourceUrl("");
      setNewResourceDesc("");
      setAddNewResource(false);
    } catch (err) {
      toaster.push(
        <Message type="error" closable duration={0}>
          {(err as HandledError).message}
        </Message>
      );
    }
  };

  const handleDelete = (index: number) => {
    const resources = [...alertData.resources];
    resources.splice(i, 1);
    onUpdate({ resources });
  };

  return (
    <div>
      <strong>Resources</strong>{" "}
      <Button
        size="xs"
        onClick={() => setAddNewResource(true)}
        color="blue"
        appearance="ghost"
      >
        Add URL?
      </Button>
      {!alertData.resources.length && (
        <p>
          <Trans>No resources added yet</Trans>.
        </p>
      )}
      {alertData.resources?.map((r, i) => (
        <li key={`resource-${i}`}>
          {r.resourceDesc} (
          <a href={r.uri} target="_blank" rel="noreferrer">
            {r.uri}
          </a>
          ) &mdash;{" "}
          <Button
            size="xs"
            color="red"
            appearance="ghost"
            onClick={() => handleDelete(i)}
          >
            <Trans>Delete?</Trans>
          </Button>
        </li>
      ))}
      {addNewResource && (
        <Stack spacing={10} alignItems="flex-end">
          <Form.Group>
            <Form.ControlLabel>
              <Trans>URL</Trans>
            </Form.ControlLabel>
            <Form.Control
              name="resourceUrl"
              onChange={(v) => setNewResourceUrl(v)}
              value={newResourceUrl}
              type="url"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>
              <Trans>Description</Trans>
            </Form.ControlLabel>
            <Form.Control
              name="resourceDesc"
              onChange={(v) => setNewResourceDesc(v)}
              value={newResourceDesc}
            />
          </Form.Group>
          <Button
            color="blue"
            appearance="ghost"
            size="sm"
            onClick={handleSave}
          >
            Save
          </Button>
        </Stack>
      )}
    </div>
  );
};
