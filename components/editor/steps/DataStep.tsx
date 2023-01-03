import { DateRangePicker, TagPicker } from "rsuite";
import { getStartOfToday } from "../../../lib/helpers";
import { FormAlertData, StepProps } from "../Editor";
import SeverityCertaintyMatrix from "../SeverityCertaintyMatrix";
import UrgencySlider from "../UrgencySlider";
import styles from "../../../styles/components/editor/Step.module.css";

// CAP info.responseType
const ACTIONS = [
  "Shelter",
  "Evacuate",
  "Prepare",
  "Execute",
  "Avoid",
  "Monitor",
  "Assess",
  "All Clear",
  "None",
];
export default function DataStep({
  onUpdate,
  from = getStartOfToday(),
  to = new Date(),
  certainty,
  severity,
  urgency,
  actions,
}: Partial<FormAlertData> & StepProps) {
  return (
    <div>
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
          onChange={(urgency: string) => onUpdate({ urgency })}
        />
      </div>
      <div>
        {severity && <div>Severity: {severity}.</div>}
        {certainty && <div>Certainty: {certainty}.</div>}
        {urgency && <div>Urgency: {urgency}.</div>}
      </div>

      <h4>Recommended Actions</h4>
      <p>
        Choose the recommended actions for the audience of the alert, using the
        dropdown menu.
      </p>
      <TagPicker
        cleanable={false}
        color="green"
        appearance="default"
        block
        data={ACTIONS.map((a) => ({ label: a, value: a.replace(" ", "") }))}
        value={actions}
        onChange={(actions) => onUpdate({ actions })}
      />
    </div>
  );
}
