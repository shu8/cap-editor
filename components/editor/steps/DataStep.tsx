import { Trans } from "@lingui/macro";
import { DateRangePicker, SelectPicker, TagPicker } from "rsuite";

import { getStartOfToday } from "../../../lib/helpers.client";
import styles from "../../../styles/components/editor/Step.module.css";
import { FormAlertData, StepProps } from "../Editor";
import SeverityCertaintyMatrix from "../SeverityCertaintyMatrix";
import UrgencySlider from "../UrgencySlider";

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
      <p>
        <Trans>
          Select the start and end time of the alert from the calendar.
        </Trans>
      </p>
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
      <h4>
        <Trans>Severity, Certainty, &amp; Urgency</Trans>
      </h4>
      <p>
        <Trans>
          Choose the severity (function of impact/intensity and certainty) and
          urgency level of the alert, by either selecting from the dropdown menu
          or by clicking the corresponding level in the matrix and slider.
        </Trans>
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
      <div className={styles.severityCertaintyUrgencyWrapper}>
        <div>
          Severity:{" "}
          <SelectPicker
            data={["Minor", "Moderate", "Severe"].map((t) => ({
              label: t,
              value: t,
            }))}
            cleanable={false}
            placeholder="Choose"
            value={severity}
            onChange={(v) => onUpdate({ severity: v! })}
          />
        </div>
        <div>
          Certainty:{" "}
          <SelectPicker
            data={["Likely", "Possible", "Unlikely"].map((t) => ({
              label: t,
              value: t,
            }))}
            cleanable={false}
            placeholder="Choose"
            value={certainty}
            onChange={(v) => onUpdate({ certainty: v! })}
          />
        </div>
        <div>
          Urgency:{" "}
          <SelectPicker
            data={["Immediate", "Expected", "Future"].map((t) => ({
              label: t,
              value: t,
            }))}
            cleanable={false}
            placeholder="Choose"
            value={urgency}
            onChange={(v) => onUpdate({ urgency: v! })}
          />
        </div>
      </div>

      <h4>
        <Trans>Recommended Actions</Trans>
      </h4>
      <p>
        <Trans>
          Choose the recommended actions for the audience of the alert, using
          the dropdown menu.
        </Trans>
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
