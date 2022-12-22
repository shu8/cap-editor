import { Slider } from "rsuite";

export default function UrgencySlider({ onChange, urgency }) {
  const labels = ["Future", "Expected", "Immediate"];

  return (
    <div style={{ height: "100px" }}>
      <Slider
        min={0}
        max={2}
        value={labels.indexOf(urgency)}
        graduated
        progress
        vertical
        renderMark={(v) => labels[v]}
        tooltip={false}
        onChange={(v) => onChange(labels[v])}
      />
    </div>
  );
}
