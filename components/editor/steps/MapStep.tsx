import { useEffect, useState } from "react";
import { TagPicker } from "rsuite";
import { FormAlertData, StepProps } from "../Editor";

export default function MapStep({
  onUpdate,
  regions = {},
  countryCode,
}: Partial<FormAlertData> & StepProps & { countryCode: string }) {
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    fetch(`/api/countries?countryCode=${countryCode}`)
      .then((res) => res.json())
      .then((res) => setCountries(res.countries));
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div>
      <p>
        Choose the location of the alert, by either selecting from the dropdown
        menu, clicking the map, or using the drawing tool.
      </p>

      <TagPicker
        block
        data={[
          ...countries.map((c) => ({ label: c, value: c })),
          ...Object.keys(regions)
            .filter((r) => r.startsWith("custom"))
            .map((r, i) => ({ label: `Custom Region ${i + 1}`, value: r })),
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
