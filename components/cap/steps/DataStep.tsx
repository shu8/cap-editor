import { DateRangePicker } from "rsuite";
import { getStartOfToday } from "../../../lib/helpers";
import { AlertData, StepProps } from "../NewAlert";
import SeverityCertaintyMatrix from "../SeverityCertaintyMatrix";
import UrgencySlider from "../UrgencySlider";
import styles from "../../../styles/components/cap/Step.module.css";

export default function DataStep({
  onUpdate,
  from = getStartOfToday(),
  to = new Date(),
  certainty,
  severity,
  urgency,
}: Partial<AlertData> & StepProps) {
  return (
    <div>
      <h4>Time and Duration</h4>
      <p>Select the start and end time of the alert from the calendar.</p>
      <DateRangePicker
        block
        format="yyyy-MM-dd HH:mm"
        showOneCalendar
        ranges={[]}
        isoWeek
        cleanable={false}
        value={[from, to]}
        character=" to "
        disabledDate={(date) => date < getStartOfToday()}
        onChange={(dates) =>
          dates && onUpdate({ from: dates[0], to: dates[1] })
        }
      />

      {/* https://www.metoffice.gov.uk/weather/guides/warnings */}
      <h4>Severity, Certainty, &amp; Urgency</h4>
      <p>
        Choose the severity (function of impact/intensity and certainty) and
        urgency level of the alert, by either selecting from the dropdown menu
        or by clicking the corresponding level in the matrix and slider.
      </p>
      <div className={styles.sideBySide}>
        <SeverityCertaintyMatrix
          certainty={certainty}
          severity={severity}
          onChange={(data: { certainty: string; severity: string }) =>
            onUpdate(data)
          }
        />
        <UrgencySlider
          urgency={urgency}
          onChange={(u: string) => onUpdate({ urgency: u })}
        />
      </div>
      <div>
        {severity && <div>Severity: {severity}.</div>}
        {certainty && <div>Certainty: {certainty}.</div>}
        {urgency && <div>Urgency: {urgency}.</div>}
      </div>
    </div>
  );
}
