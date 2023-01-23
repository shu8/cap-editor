import { t, Trans } from "@lingui/macro";
import { useEffect, useState } from "react";
import { TagPicker, useToaster } from "rsuite";
import { HandledError, useMountEffect } from "../../../lib/helpers";
import ErrorMessage from "../../ErrorMessage";
import { FormAlertData, StepProps } from "../Editor";

export default function MapStep({
  onUpdate,
  regions = {},
  countryCode,
}: Partial<FormAlertData> & StepProps & { countryCode: string }) {
  const toaster = useToaster();
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    fetch(`/api/countries?countryCode=${countryCode}`)
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

  return (
    <div>
      <p>
        <Trans>
          Choose the location of the alert, by either selecting from the
          dropdown menu, clicking the map, or using the drawing tool.
        </Trans>
      </p>

      <TagPicker
        block
        data={[
          ...countries.map((c) => ({ label: c, value: c })),
          ...Object.keys(regions)
            .filter((r) => r.startsWith("custom"))
            .map((r) => ({ label: r.replace("custom-", ""), value: r })),
        ]}
        cleanable={false}
        value={Object.keys(regions)}
        onChange={(selected) => {
          Object.keys(regions).forEach((r) => {
            if (!selected.includes(r)) {
              delete regions[r];
            }
          });
          for (const region of selected) {
            if (!regions[region]) {
              regions[region] = [];
            }
          }
          onUpdate({ regions: { ...regions } });
        }}
      />
    </div>
  );
}
