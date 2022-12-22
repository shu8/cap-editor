import { Slider } from "rsuite";
import { getStartOfToday } from "../../lib/helpers";
import { classes } from "../../lib/helpers";
import styles from "../../styles/components/cap/SeverityCertaintyMatrix.module.css";

export default function UrgencySlider({ onChange, urgency }) {
  const labels = ["Future", "Expected", "Immediate"];

  return (
    <div style={{ height: "100px" }}>
      <Slider
        min={0}
        max={2}
        value={labels.indexOf(urgency)}
        graduated
        vertical
        renderMark={(v) => labels[v]}
        tooltip={false}
        onChange={(v) => onChange(labels[v])}
      />
    </div>
  );
}
