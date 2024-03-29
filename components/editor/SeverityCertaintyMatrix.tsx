import { Trans } from "@lingui/macro";
import { classes } from "../../lib/helpers.client";
import styles from "../../styles/components/editor/SeverityCertaintyMatrix.module.css";

export default function SeverityCertaintyMatrix({
  onChange,
  certainty,
  severity,
  disabled,
}: {
  onChange: (data: { certainty: string; severity: string }) => void;
  certainty: string;
  severity: string;
  disabled?: boolean;
}) {
  const Cell = (props: {
    colorStyle: string;
    cellCertainty: string;
    cellSeverity: string;
  }) => (
    <div
      className={classes(
        styles.cell,
        props.colorStyle,
        props.cellCertainty === certainty &&
          props.cellSeverity === severity &&
          styles.selected,
        disabled && styles.disabled
      )}
      onClick={() => {
        if (disabled) return;
        onChange({
          certainty: props.cellCertainty,
          severity: props.cellSeverity,
        });
      }}
    />
  );

  return (
    <div className={styles.matrix}>
      <div className={styles.cellWrapper}>
        <div
          style={{
            position: "absolute",
            left: "-25px",
            writingMode: "vertical-lr",
            transform: "rotate(180deg)",
          }}
        >
          <Trans>Certainty</Trans> &#10230;
        </div>

        <Cell
          colorStyle={styles.yellow}
          cellCertainty="Observed"
          cellSeverity="Minor"
        />
        <Cell
          colorStyle={styles.amber}
          cellCertainty="Observed"
          cellSeverity="Moderate"
        />
        <Cell
          colorStyle={styles.red}
          cellCertainty="Observed"
          cellSeverity="Severe"
        />
        <Cell
          colorStyle={styles.red}
          cellCertainty="Observed"
          cellSeverity="Extreme"
        />
        <Cell
          colorStyle={styles.yellow}
          cellCertainty="Likely"
          cellSeverity="Minor"
        />
        <Cell
          colorStyle={styles.amber}
          cellCertainty="Likely"
          cellSeverity="Moderate"
        />
        <Cell
          colorStyle={styles.amber}
          cellCertainty="Likely"
          cellSeverity="Severe"
        />
        <Cell
          colorStyle={styles.red}
          cellCertainty="Likely"
          cellSeverity="Extreme"
        />
        <Cell
          colorStyle={styles.green}
          cellCertainty="Possible"
          cellSeverity="Minor"
        />
        <Cell
          colorStyle={styles.yellow}
          cellCertainty="Possible"
          cellSeverity="Moderate"
        />
        <Cell
          colorStyle={styles.amber}
          cellCertainty="Possible"
          cellSeverity="Severe"
        />
        <Cell
          colorStyle={styles.amber}
          cellCertainty="Possible"
          cellSeverity="Extreme"
        />
        <Cell
          colorStyle={styles.green}
          cellCertainty="Unlikely"
          cellSeverity="Minor"
        />
        <Cell
          colorStyle={styles.green}
          cellCertainty="Unlikely"
          cellSeverity="Moderate"
        />
        <Cell
          colorStyle={styles.yellow}
          cellCertainty="Unlikely"
          cellSeverity="Severe"
        />
        <Cell
          colorStyle={styles.yellow}
          cellCertainty="Unlikely"
          cellSeverity="Extreme"
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <Trans>Impact/Intensity</Trans> &#10230;
      </div>
    </div>
  );
}
