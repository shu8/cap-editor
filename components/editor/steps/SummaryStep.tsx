import ISO6391 from "iso-639-1";
import { IconButton } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";

import styles from "../../../styles/components/cap/Step.module.css";
import { FormAlertData, Step } from "../Editor";
import { classes } from "../../../lib/helpers";

const ReviewItem = (props: {
  field: string;
  newLine?: boolean;
  value: string;
}) => (
  <div className={classes(styles.reviewItem)}>
    <strong>{props.field}: </strong>
    {props.newLine && <br />}
    {props.value}
  </div>
);

export default function SummaryStep({
  jumpToStep,
  ...alertData
}: FormAlertData & {
  jumpToStep: (step: Step) => void;
}) {
  const Header = (props: { step: Step }) => (
    <div className={classes(styles.header)}>
      <h5>
        {props.step}{" "}
        <IconButton
          icon={<EditIcon />}
          size="sm"
          appearance="subtle"
          onClick={() => jumpToStep(props.step)}
        />
      </h5>
    </div>
  );

  return (
    <div>
      <p>
        Please review and confirm the alert&apos;s information presented below.
      </p>
      <div className={styles.reviewStepsWrapper}>
        <div className={styles.reviewStep}>
          <Header step="metadata" />
          <ReviewItem field="Status" value={alertData.status ?? "NONE"} />
          <ReviewItem
            field="Message Type"
            value={alertData.msgType ?? "NONE"}
          />
          <ReviewItem field="Scope" value={alertData.scope ?? "NONE"} />
          <ReviewItem
            field="Restriction"
            value={alertData.restriction ?? "NONE"}
          />
          <ReviewItem
            field="Addresses"
            value={alertData.addresses?.join("; ") ?? "NONE"}
          />
          <ReviewItem
            field="References"
            value={alertData.references?.join("; ") ?? "NONE"}
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="category" />
          <ReviewItem
            field="Alert Category"
            value={alertData.category?.join(", ") ?? "NONE"}
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="map" />
          <ReviewItem
            field="Regions"
            value={
              Object.keys(alertData.regions ?? {})
                .map((r) => r.replace("custom-", ""))
                .join(", ") || "NONE"
            }
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="data" />
          <ReviewItem
            field="From"
            value={alertData.from?.toLocaleString() ?? "NONE"}
          />
          <ReviewItem
            field="To"
            value={alertData.to?.toLocaleString() ?? "NONE"}
          />
          <ReviewItem field="Severity" value={alertData.severity ?? "NONE"} />
          <ReviewItem field="Certainty" value={alertData.certainty ?? "NONE"} />
          <ReviewItem field="Urgency" value={alertData.urgency ?? "NONE"} />
        </div>

        <div className={styles.reviewStep}>
          <Header step="text" />
          <ReviewItem
            field="Actions"
            value={alertData.actions?.join(", ") ?? "NONE"}
          />

          {Object.entries(alertData.textLanguages).map(
            ([language, languageData]) => (
              <div
                className={styles.languageWrapper}
                key={`language-summary-${language}`}
              >
                <i className={styles.language}>{ISO6391.getName(language)}</i>
                <ReviewItem
                  field={`Event`}
                  value={languageData.event ?? "NONE"}
                />
                <ReviewItem
                  field={`Headline`}
                  value={languageData.headline ?? "NONE"}
                />
                <ReviewItem
                  field={`Description`}
                  value={languageData.description ?? "NONE"}
                />
                <ReviewItem
                  field={`Instruction`}
                  value={languageData.instruction ?? "NONE"}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
