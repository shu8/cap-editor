import { t, Trans } from "@lingui/macro";
import EditIcon from "@rsuite/icons/Edit";
import ISO6391 from "iso-639-1";
import { IconButton } from "rsuite";

import { classes } from "../../../lib/helpers.client";
import styles from "../../../styles/components/editor/Step.module.css";
import { FormAlertData, Step } from "../Editor";

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
        <Trans>
          Please review and confirm the alert&apos;s information presented
          below.
        </Trans>
      </p>
      <div className={styles.reviewStepsWrapper}>
        <div className={styles.reviewStep}>
          <Header step="metadata" />
          <ReviewItem field="Status" value={alertData.status ?? t`NONE`} />
          <ReviewItem
            field="Message Type"
            value={alertData.msgType ?? t`NONE`}
          />
          <ReviewItem field="Scope" value={alertData.scope ?? t`NONE`} />
          <ReviewItem
            field="Restriction"
            value={alertData.restriction ?? t`NONE`}
          />
          <ReviewItem
            field="Addresses"
            value={alertData.addresses?.join("; ") ?? t`NONE`}
          />
          <ReviewItem
            field="References"
            value={alertData.references?.join("; ") ?? t`NONE`}
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="category" />
          <ReviewItem
            field="Alert Category"
            value={alertData.category?.join("; ") ?? t`NONE`}
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="map" />
          <ReviewItem
            field="Regions"
            value={
              Object.keys(alertData.regions ?? {})
                .map((r) => r.replace("custom-", ""))
                .join("; ") || t`NONE`
            }
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="data" />
          <ReviewItem
            field="From"
            value={alertData.from?.toLocaleString() ?? t`NONE`}
          />
          <ReviewItem
            field="To"
            value={alertData.to?.toLocaleString() ?? t`NONE`}
          />
          <ReviewItem field="Severity" value={alertData.severity ?? t`NONE`} />
          <ReviewItem
            field="Certainty"
            value={alertData.certainty ?? t`NONE`}
          />
          <ReviewItem field="Urgency" value={alertData.urgency ?? t`NONE`} />

          <ReviewItem
            field="Actions"
            value={alertData.actions?.join("; ") ?? t`NONE`}
          />
        </div>

        <div className={styles.reviewStep}>
          <Header step="text" />

          {Object.entries(alertData.textLanguages).map(
            ([language, languageData]) => (
              <div
                className={styles.languageWrapper}
                key={`language-summary-${language}`}
              >
                <i className={styles.language}>{ISO6391.getName(language)}</i>
                <ReviewItem
                  field="Event"
                  value={languageData.event ?? t`NONE`}
                />
                <ReviewItem
                  field="Headline"
                  value={languageData.headline ?? t`NONE`}
                />
                <ReviewItem
                  field="Description"
                  value={languageData.description ?? t`NONE`}
                />
                <ReviewItem
                  field="Instruction"
                  value={languageData.instruction ?? t`NONE`}
                />
                <ReviewItem
                  field="Resources"
                  value={languageData.resources
                    .map((r) => r.resourceDesc)
                    .join("; ")}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
