import { DateRangePicker } from "rsuite";
import { useState } from "react";
import { getStartOfToday } from "../../../lib/helpers";

export default function DataStep({ onNext }) {
  const [data, setData] = useState({});

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
        character=" to "
        disabledDate={(date) => date < getStartOfToday()}
      />

      <h4>Severity, Certainty, &amp; Urgency</h4>
      <p>
        Choose the severity (function of intensity/impact and certainty) and
        urgency level of the alert, by either selecting from the dropdown meny
        or by clicking the corresponding level in the matrix and slider.
      </p>
    </div>
  );
}
