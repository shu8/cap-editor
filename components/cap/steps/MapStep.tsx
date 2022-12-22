import { TagPicker } from "rsuite";
import { AlertData, StepProps } from "../NewAlert";

export default function MapStep({
  onUpdate,
  regions,
}: Partial<AlertData> & StepProps) {
  return (
    <div>
      <h4>Location</h4>
      <p>
        Choose the location of the alert, by either selecting from the dropdown
        menu, clicking the map, or using the drawing tool.
      </p>

      <TagPicker
        block
        data={[
          { label: "England", value: "England" },
          { label: "Wales", value: "Wales" },
        ]}
        value={regions}
        onChange={(regions) => onUpdate({ regions })}
      />
    </div>
  );
}
