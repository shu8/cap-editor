import { useEffect, useState } from "react";
import { TagPicker } from "rsuite";
import { AlertData, StepProps } from "../NewAlert";

export default function MapStep({
  onUpdate,
  regions = {},
}: Partial<AlertData> & StepProps) {
  const [countries, setCountries] = useState([]);

  const fetchCountries = async () => {
    fetch("/api/countries")
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
        onOpen={fetchCountries}
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
