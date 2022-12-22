import { DateRangePicker } from "rsuite";
import { getStartOfToday } from "../../../lib/helpers";
import { AlertData, StepProps } from "../NewAlert";

export default function DataStep({
  onUpdate,
  from = getStartOfToday(),
  to = new Date(),
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
        Choose the severity (function of intensity/impact and certainty) and
        urgency level of the alert, by either selecting from the dropdown meny
        or by clicking the corresponding level in the matrix and slider.
      </p>
    </div>
  );
}
