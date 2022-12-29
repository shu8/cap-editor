import { classes } from "../../../lib/helpers";
import { AlertData, Step } from "../NewAlert";
import styles from "../../../styles/components/cap/Step.module.css";
import { IconButton } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";

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
}: Partial<AlertData> & {
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
          <ReviewItem field="Event" value={alertData.event ?? "NONE"} />
        </div>
        <div className={styles.reviewStep}>
          <Header step="map" />
          <ReviewItem
            field="Regions"
            value={Object.keys(alertData.regions ?? {}).join(", ") ?? "NONE"}
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
          <ReviewItem field="Headline" value={alertData.headline ?? "NONE"} />
          <ReviewItem
            field="Description"
            newLine
            value={alertData.description ?? "NONE"}
          />
          <ReviewItem
            field="Instruction"
            newLine
            value={alertData.instruction ?? "NONE"}
          />
          <ReviewItem
            field="Actions"
            value={alertData.actions?.join(", ") ?? "NONE"}
          />
        </div>
      </div>
    </div>
  );
}
