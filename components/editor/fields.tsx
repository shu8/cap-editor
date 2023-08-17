import { Trans, t } from "@lingui/macro";
import {
  Button,
  CheckPicker,
  DatePicker,
  Divider,
  Form,
  Input,
  InputPicker,
  Message,
  SelectPicker,
  Stack,
} from "rsuite";
import { FormAlertData } from "./EditorSinglePage";
import timezones from "timezones.json";
import { iso6393 } from "iso-639-3";
import React, { useEffect, useState } from "react";
import { HandledError, useMountEffect } from "../../lib/helpers.client";
import { useToasterI18n } from "../../lib/useToasterI18n";
import Map from "./map/Map";
import { Alert, AlertingAuthority } from "@prisma/client";
import ErrorMessage from "../ErrorMessage";
import styles from "../../styles/components/editor/EditorSinglePage.module.css";
import { RangeType } from "rsuite/esm/DatePicker";
import { DateTime } from "luxon";

const predefinedTimeRanges: RangeType<Date>[] = [
  {
    label: "now",
    value: new Date(),
    placement: "left",
  },
  {
    label: "today, end",
    value: DateTime.now().endOf("day").toJSDate(),
    placement: "left",
  },
  {
    label: "tomorrow, start",
    value: DateTime.now().plus({ days: 1 }).startOf("day").toJSDate(),
    placement: "left",
  },
  {
    label: "tomorrow, end",
    value: DateTime.now().plus({ days: 1 }).endOf("day").toJSDate(),
    placement: "left",
  },
  {
    label: "in one hour",
    value: DateTime.now().plus({ hours: 1 }).toJSDate(),
    placement: "left",
  },
];

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
  onOpen,
  multi,
}: {
  label: string;
  fieldName: keyof FormAlertData;
  options: string[] | { label: string; value: any }[];
  searchable?: boolean;
  onOpen?: () => void;
  multi?: boolean;
} & Props) => (
  <Form.Group>
    <Form.ControlLabel>{label}</Form.ControlLabel>
    <Form.Control
      name={fieldName}
      accepter={multi ? CheckPicker : SelectPicker}
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
      onOpen={() => onOpen?.()}
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
      ranges={predefinedTimeRanges}
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

export const References = ({
  onUpdate,
  alertData,
  alertingAuthorityId,
}: Props & { alertingAuthorityId: string }) => {
  const toaster = useToasterI18n();
  const [referenceOptions, setReferenceOptions] = useState<Alert[]>([]);
  const fetchReferenceOptions = () => {
    fetch(`/api/alerts/alertingAuthorities/${alertingAuthorityId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);

        // Ensure we don't show option to reference current alert (e.g., when editing a draft)
        setReferenceOptions(
          res.alerts.filter((a: Alert) => a.id !== alertData.identifier)
        );
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage
            error={err}
            action={t`fetching the list of reference alerts`}
          />
        )
      );
  };

  return (
    <DropdownField
      multi
      onOpen={fetchReferenceOptions}
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`References`}
      options={referenceOptions.map((alert) => ({
        label: `${alert.data.info[0].headline} - sent ${alert.data.sent} (${alert.id})`,
        value: `${alert.data.sender},${alert.id},${alert.data.sent}`,
      }))}
      fieldName="references"
    />
  );
};

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

export const MapForm = ({
  onUpdate,
  alertData,
  alertingAuthority,
}: Props & { alertingAuthority: AlertingAuthority }) => {
  const toaster = useToasterI18n();
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [customPolygonInput, setCustomPolygonInput] = useState("");

  const polygonStringToArray = (str: string) => {
    const arr = [];
    const coordPairs = str.split(" ");
    for (let i = 0; i < coordPairs.length; i++) {
      const nums = coordPairs[i].split(",");
      const x = +nums[0];
      const y = +nums[1];
      if (isNaN(x) || isNaN(y)) return null;
      arr.push([x, y]);
    }
    return arr;
  };

  const polygonArrayToString = (arr: number[][]) =>
    arr.map((v: number[]) => v.join(",")).join(" ");

  const fetchCountries = async () => {
    fetch(`/api/countries?countryCode=${alertingAuthority.countryCode}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        setCountries(res.countries);
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage error={err} action={t`fetching map regions`} />
        )
      );
  };

  useMountEffect(() => {
    fetchCountries();
  });

  const regions = { ...alertData.regions };
  useEffect(() => {
    // Don't reset custom polygon input whilst user is typing an invalid input
    if (
      regions[selectedRegion]?.length === 1 &&
      regions[selectedRegion][0]?.length === 0
    ) {
      return;
    }

    setCustomPolygonInput(polygonArrayToString(regions[selectedRegion] ?? []));
  }, [selectedRegion, regions]);

  return (
    <div className={styles.mapForm}>
      <Map
        onRegionsChange={(regions) => onUpdate({ regions })}
        regions={alertData.regions}
        alertingAuthority={alertingAuthority}
        editingRegion={selectedRegion}
      />

      <div className={styles.mapFormGroup}>
        <Form.Group>
          <Form.ControlLabel>
            <Trans>Area Description</Trans>
          </Form.ControlLabel>
          <Form.Control
            accepter={InputPicker}
            name="regions"
            placeholder={t`Choose/type area name...`}
            block
            data={Object.keys(regions).map((r) => ({
              label: r.replace("custom-", ""),
              value: r,
            }))}
            creatable
            cleanable={false}
            value={selectedRegion}
            onChange={(selected) => {
              setSelectedRegion(selected);
            }}
          />
          <Form.HelpText>
            <Trans>Type the description of a custom area, or quick-add:</Trans>
            <br />
            <Stack
              divider={
                <Divider vertical className={styles.countryQuickAddDivider} />
              }
              wrap
              spacing={0}
            >
              {countries.map((c, i) => (
                <Button
                  appearance="link"
                  size="xs"
                  key={`country-${i}`}
                  className={styles.countryQuickAddLink}
                  onClick={() => {
                    regions[c] = [];
                    onUpdate({ regions });

                    // The Map component adds the actual coordinates of the quick-added location when it sees a new region with [] coordinates.
                    // We need to update the selected region only after the coordinates have been updated.
                    setTimeout(() => setSelectedRegion(c), 0);
                  }}
                >
                  {c}
                </Button>
              ))}
            </Stack>
          </Form.HelpText>
        </Form.Group>

        {selectedRegion && (
          <>
            <strong>{selectedRegion}</strong>
            <Button
              size="xs"
              color="red"
              appearance="link"
              onClick={() => {
                delete regions[selectedRegion];
                onUpdate({ regions });
                setSelectedRegion("");
              }}
            >
              Delete?
            </Button>
            <Form.Group>
              <Form.ControlLabel>
                <Trans>Polygon</Trans>
              </Form.ControlLabel>
              <Form.Control
                name="polygon"
                accepter={Textarea}
                value={customPolygonInput}
                onChange={(v) => {
                  setCustomPolygonInput(v);
                  const arr = polygonStringToArray(v);
                  regions[selectedRegion] = arr ?? [[]];
                  onUpdate({ regions });
                }}
              />
              <Form.HelpText>
                Use the drawing tool or paste in polygon coordinates
                (space-delimited coordinate pairs, with matching first and last
                pair)
              </Form.HelpText>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>
                <Trans>Circle</Trans>
              </Form.ControlLabel>
              <Form.Control name="circle" accepter={Textarea} />
              <Form.HelpText>
                Use the drawing tool or paste in circle coordinates
              </Form.HelpText>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>
                <Trans>Geocode</Trans>
              </Form.ControlLabel>
              <Form.Control name="geocode" />
            </Form.Group>
          </>
        )}
      </div>
    </div>
  );
};
