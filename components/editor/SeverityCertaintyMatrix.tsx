import { Trans } from "@lingui/macro";
import { classes } from "../../lib/helpers.client";
import styles from "../../styles/components/editor/SeverityCertaintyMatrix.module.css";

export default function SeverityCertaintyMatrix({
  onChange,
  certainty,
  severity,
}) {
  const Cell = ({ colorStyle, cellCertainty, cellSeverity }) => (
    <div
      className={classes(
        styles.cell,
        colorStyle,
        cellCertainty === certainty &&
          cellSeverity === severity &&
          styles.selected
      )}
      onClick={() =>
        onChange({ certainty: cellCertainty, severity: cellSeverity })
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
