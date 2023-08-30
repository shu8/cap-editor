import { Trans, t } from "@lingui/macro";
import { useEffect, useState } from "react";
import { Button, Divider, Form, InputPicker, Stack } from "rsuite";
import {
  HandledError,
  flipNestedArrayCoordinates,
  roundNestedArray,
  useMountEffect,
} from "../../../lib/helpers.client";
import { UserAlertingAuthority } from "../../../lib/types/types";
import { useToasterI18n } from "../../../lib/useToasterI18n";
import ErrorMessage from "../../ErrorMessage";
import KeyValueInput from "../../KeyValueInput";
import Map from "../map/Map";
import { FieldProps, Textarea } from "./common";
import styles from "../../../styles/components/editor/EditorSinglePage.module.css";

const POSITIVE_COORDINATE_REGEX = /\d+(\.\d{1,3})?/;
const COORDINATE_REGEX = /-?\d+(\.\d{1,3})?/;

export default function MapForm({
  onUpdate,
  alertData,
  disabled,
  alertingAuthority,
}: FieldProps & { alertingAuthority: UserAlertingAuthority }) {
  const toaster = useToasterI18n();
  const [countries, setCountries] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [customPolygonInput, setCustomPolygonInput] = useState("");
  const [customCircleInput, setCustomCircleInput] = useState("");

  const polygonStringToArray = (str: string) => {
    const arr = [];
    const lines = str.split("\n");
    for (const line of lines) {
      const coordPairs = line.split(" ");
      const coords = [];
      for (const c of coordPairs) {
        const nums = c.split(",");
        const x = +nums[0];
        const y = +nums[1];
        if (isNaN(x) || isNaN(y)) return null;
        coords.push([x, y]);
      }
      if (coords.length < 4) return null;
      if (coords[0].toString() !== coords[coords.length - 1].toString()) {
        return null;
      }
      arr.push(coords);
    }

    return arr;
  };

  const polygonArrayToString = (arr: number[][][]) =>
    arr
      .map((coords) => coords.map((v: number[]) => v.join(",")).join(" "))
      .join("\n");

  const circlesStringToArray = (str: string) => {
    const arr = [];
    const lines = str.split("\n");
    const regex = new RegExp(
      `^${COORDINATE_REGEX.source},${COORDINATE_REGEX.source} ${POSITIVE_COORDINATE_REGEX.source}$`
    );

    for (const line of lines) {
      if (line.match(regex)) arr.push(line);
      else return null;
    }
    return arr;
  };

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
  }, [selectedRegion, alertData.regions]);

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
            disabled={disabled}
            value={selectedRegion}
            onChange={(country) => {
              if (!country) return;
              if (!regions[country]) {
                regions[country] = {
                  polygons: [],
                  circles: [],
                  geocodes: {},
                };
                onUpdate({ regions });
              }

              setSelectedRegion(country);
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
                    disabled={disabled}
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
              disabled={disabled}
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
                disabled={disabled}
                accepter={Textarea}
                value={customPolygonInput}
                onChange={(v) => {
                  setCustomPolygonInput(v);
                  const arr = polygonStringToArray(v);
                  if (arr) {
                    regions[selectedRegion].polygons = arr;
                    onUpdate({ regions });
                  }
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
                disabled={disabled}
                accepter={Textarea}
                value={customCircleInput}
                onChange={(v) => {
                  setCustomCircleInput(v);
                  const arr = circlesStringToArray(v);
                  if (arr) {
                    regions[selectedRegion].circles = arr;
                    onUpdate({ regions });
                  }
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
                  disabled={disabled}
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
}
