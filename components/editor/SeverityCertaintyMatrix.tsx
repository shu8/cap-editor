import { Trans } from "@lingui/macro";
import { classes } from "../../lib/helpers.client";
import styles from "../../styles/components/editor/SeverityCertaintyMatrix.module.css";

export default function SeverityCertaintyMatrix({
  onChange,
  certainty,
  severity,
}: {
  onChange: (data: { certainty: string; severity: string }) => void;
  certainty: string;
  severity: string;
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
          styles.selected
      )}
      onClick={() =>
        onChange({
          certainty: props.cellCertainty,
          severity: props.cellSeverity,
        })
      }
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
          cellCertainty="Likely"
          cellSeverity="Minor"
        />
        <Cell
          colorStyle={styles.amber}
          cellCertainty="Likely"
          cellSeverity="Moderate"
        />
        <Cell
          colorStyle={styles.red}
          cellCertainty="Likely"
          cellSeverity="Severe"
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
      </div>

      <div style={{ textAlign: "center" }}>
        <Trans>Impact/Intensity</Trans> &#10230;
      </div>
    </div>
  );
}
