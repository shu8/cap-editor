import { classes } from "../../../lib/helpers";
import { AlertData, Step } from "../NewAlert";
import styles from "../../../styles/components/cap/Step.module.css";
import { IconButton } from "rsuite";
import EditIcon from "@rsuite/icons/Edit";

export default function SummaryStep({
  jumpToStep,
  ...alertData
}: Partial<AlertData> & {
  jumpToStep: (step: Step) => void;
}) {
  const ReviewItem = (props: { field: string; value: string; step: Step }) => (
    <div className={classes(styles.reviewItem)}>
      <h5>
        {props.field}
        <IconButton
          className={classes(styles.editIcon)}
          icon={<EditIcon />}
          size="sm"
          appearance="subtle"
          onClick={() => jumpToStep(props.step)}
        />
      </h5>
      {props.value}
    </div>
  );

  return (
    <div>
      <h4>Summary of the alert</h4>
      <p>
        Please review and confirm the alert&apos;s information presented below.
      </p>
      <ReviewItem
        field="Hazard Type"
        value={alertData.hazardType ?? "NONE"}
        step="hazard"
      />
      <ReviewItem
        field="Regions"
        value={alertData.regions?.join(", ") ?? "NONE"}
        step="map"
      />
      <ReviewItem
        field="From"
        value={alertData.from?.toLocaleString() ?? "NONE"}
        step="data"
      />
      <ReviewItem
        field="To"
        value={alertData.to?.toLocaleString() ?? "NONE"}
        step="data"
      />
      <ReviewItem
        field="Headline"
        value={alertData.headline ?? "NONE"}
        step="text"
      />
      <ReviewItem
        field="Description"
        value={alertData.description ?? "NONE"}
        step="text"
      />
      <ReviewItem
        field="Instruction"
        value={alertData.instruction ?? "NONE"}
        step="text"
      />
      <ReviewItem
        field="Actions"
        value={alertData.actions?.join(", ") ?? "NONE"}
        step="text"
      />
    </div>
  );
}
