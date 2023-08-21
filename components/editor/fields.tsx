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
  Modal,
  Nav,
  Panel,
  PanelGroup,
  SelectPicker,
  Stack,
} from "rsuite";
import { FormAlertData } from "./EditorSinglePage";
import timezones from "timezones.json";
import { iso6393 } from "iso-639-3";
import React, { ReactNode, useEffect, useState } from "react";
import {
  HandledError,
  camelise,
  flipNestedArrayCoordinates,
  roundNestedArray,
  useMountEffect,
} from "../../lib/helpers.client";
import { useToasterI18n } from "../../lib/useToasterI18n";
import Map from "./map/Map";
import { Alert, AlertingAuthority } from "@prisma/client";
import ErrorMessage from "../ErrorMessage";
import styles from "../../styles/components/editor/EditorSinglePage.module.css";
import { RangeType } from "rsuite/esm/DatePicker";
import { DateTime } from "luxon";
import { WhatNowResponse } from "../../lib/types/types";
import KeyValueInput from "../KeyValueInput";

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
  help?: string | ReactNode;
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

const WhatNowMessage = ({
  message,
  eventKey,
  onChosenText,
}: {
  message: WhatNowResponse;
  eventKey: number;
  onChosenText: (string) => void;
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
          message.translations[chosenLanguage].stages[camelise(stage)].join(
            "\n- "
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
                onClick={() => onChosenText(`- ${text}`)}
              >
                <Trans>Add this text?</Trans>
              </Button>
            </summary>
            <p className="displayWhiteSpace">- {text}</p>
          </details>
        );
      })}
    </Panel>
  );
};

export const Instruction = ({
  onUpdate,
  alertData,
  alertingAuthority,
}: Props & { alertingAuthority: AlertingAuthority }) => {
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
};

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
    options={["Immediate", "Expected", "Future", "Past", "Unknown"]}
    fieldName="urgency"
  />
);

export const Certainty = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Certainty`}
    options={["Observed", "Likely", "Possible", "Unlikely", "Unknown"]}
    fieldName="certainty"
  />
);

export const Severity = ({ onUpdate, alertData }: Props) => (
  <DropdownField
    onUpdate={onUpdate}
    alertData={alertData}
    label={t`Severity`}
    options={["Extreme", "Severe", "Moderate", "Minor", "Unknown"]}
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

  const getMimeType = async (url: string): Promise<string> => {
    const res = await fetch("/api/mime?" + new URLSearchParams({ url })).then(
      (res) => res.json()
    );
    if (res.error) throw new HandledError(res.message);
    return res.mime;
  };

  return (
    <Form.Group>
      <Form.ControlLabel>
        <Trans>Resources</Trans>{" "}
        <KeyValueInput
          keyLabel="Description"
          valueLabel="URL"
          addLabel={t`Add URL?`}
          emptyLabel={
            <Form.HelpText>
              <Trans>No resources added yet</Trans>
            </Form.HelpText>
          }
          values={alertData.resources.reduce((acc, cur) => {
            acc[cur.resourceDesc] = cur.uri;
            return acc;
          }, {})}
          onChange={async (newResources) => {
            const resourceDescriptions = Object.keys(newResources);
            const resourceMimeTypes = await Promise.allSettled(
              resourceDescriptions.map((desc) =>
                getMimeType(newResources[desc])
              )
            );

            const resources = [];
            let hasError = false;
            for (let i = 0; i < resourceMimeTypes.length; i++) {
              if (resourceMimeTypes[i].status === "fulfilled") {
                resources.push({
                  resourceDesc: resourceDescriptions[i],
                  uri: newResources[resourceDescriptions[i]],
                  mimeType: resourceMimeTypes[i].value,
                });
              } else {
                hasError = true;
              }
            }

            if (hasError) {
              toaster.push(
                <Message type="error" closable>
                  <Trans>
                    There was an error accessing one or more resources. They may
                    be currently unavailable.
                  </Trans>
                </Message>,
                { duration: 0 }
              );
            }

            onUpdate({ resources });
          }}
        />
      </Form.ControlLabel>
    </Form.Group>
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
  const [customCircleInput, setCustomCircleInput] = useState("");

  const polygonStringToArray = (str: string) => {
    const polygons = str.split("\n");
    const arr = polygons.map((polygonStr) => {
      const coordPairs = polygonStr.split(" ");
      return coordPairs.map((c) => {
        const nums = c.split(",");
        const x = +nums[0];
        const y = +nums[1];
        if (isNaN(x) || isNaN(y)) return [];
        return [x, y];
      });
    });

    return arr;
  };

  const polygonArrayToString = (arr: number[][][]) =>
    arr
      .map((coords) => coords.map((v: number[]) => v.join(",")).join(" "))
      .join("\n");

  const fetchAlertingAuthorityRegions = async () => {
    fetch(`/geojson-regions?countryCode=${alertingAuthority?.countryCode}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        setCountries(res);
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage error={err} action={t`fetching map regions`} />
        )
      );
  };

  useMountEffect(() => {
    fetchAlertingAuthorityRegions();
  });

  const regions = { ...alertData.regions };
  useEffect(() => {
    setCustomPolygonInput(
      polygonArrayToString(regions[selectedRegion]?.polygons ?? [])
    );
    setCustomCircleInput(regions[selectedRegion]?.circles?.join("\n") ?? "");
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
            cleanable
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
              {countries?.features?.map((f) => {
                const country = f.id;
                return (
                  <Button
                    appearance="link"
                    size="xs"
                    key={`country-${f.id}`}
                    className={styles.countryQuickAddLink}
                    onClick={() => {
                      if (!regions[country]) {
                        regions[country] = {
                          polygons: [],
                          circles: [],
                          geocodes: {},
                        };
                      }

                      regions[country].polygons.push(
                        ...flipNestedArrayCoordinates(
                          roundNestedArray(f.geometry.coordinates, 3)
                        )
                      );
                      onUpdate({ regions });
                      setSelectedRegion(country);
                    }}
                  >
                    {country}
                  </Button>
                );
              })}
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
              <Trans>Delete?</Trans>
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
                  if (arr) regions[selectedRegion].polygons = arr;
                  onUpdate({ regions });
                }}
              />
              <Form.HelpText>
                <Trans>
                  Use the drawing tool or paste in polygon coordinates
                  (space-delimited coordinate pairs "lat,long", with matching
                  first and last pair). Enter each polygon's coordinates on a
                  new line.
                </Trans>
              </Form.HelpText>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>
                <Trans>Circle</Trans>
              </Form.ControlLabel>
              <Form.Control
                name="circle"
                accepter={Textarea}
                value={customCircleInput}
                onChange={(v) => {
                  setCustomCircleInput(v);
                  regions[selectedRegion].circles = v.split("\n");
                  onUpdate({ regions });
                }}
              />
              <Form.HelpText>
                <Trans>
                  Use the drawing tool or paste in circle coordinates ("lat,long
                  radiusKm"). Enter each circle's coordinates on a new line.
                </Trans>
              </Form.HelpText>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>
                <Trans>Geocode</Trans>{" "}
                <KeyValueInput
                  keyLabel="Type"
                  valueLabel="Geocode"
                  addLabel={t`Add Geocode?`}
                  emptyLabel={
                    <Form.HelpText>
                      <Trans>No geocodes added yet</Trans>
                    </Form.HelpText>
                  }
                  values={regions[selectedRegion]?.geocodes}
                  onChange={(geocodes) => {
                    alertData.regions[selectedRegion].geocodes = geocodes;
                    onUpdate({ regions });
                  }}
                />
              </Form.ControlLabel>
            </Form.Group>
          </>
        )}
      </div>
    </div>
  );
};
