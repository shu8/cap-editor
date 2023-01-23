import { Button, Panel, Tag } from "rsuite";
import { Alert as DBAlert } from "@prisma/client";
import Link from "next/link";

import styles from "../styles/components/Alert.module.css";
import { CAPV12JSONSchema } from "../lib/types/cap.schema";
import { Trans } from "@lingui/macro";

const colors = {
  urgency: {
    Immediate: "red",
    Expected: "orange",
    Future: "yellow",
    Past: "cyan",
    Unknown: "blue",
  },
  certainty: {
    Likely: "red",
    Observed: "orange",
    Possible: "yellow",
    Unlikely: "cyan",
    Unknown: "blue",
  },
  severity: {
    Severe: "red",
    Extreme: "orange",
    Moderate: "yellow",
    Minor: "cyan",
    Unknown: "blue",
  },
};

export default function Alert({ alert }: { alert: DBAlert }) {
  const alertData = alert.data as CAPV12JSONSchema;
  const info = alertData.info?.[0];

  const expiryDate = new Date(info?.expires);
  const expired = expiryDate < new Date();
  return (
    <Panel
      bordered
      header={
        <>
          <strong>{info?.headline}</strong> <i>({info?.category.join(", ")})</i>{" "}
          {alert.status === "PUBLISHED" && !expired && info?.web && (
            <a
              className={styles.btn}
              target="_blank"
              href={`/feed/${alertData.identifier}`}
              rel="noreferrer"
            >
              <Button appearance="ghost" color="violet" size="xs">
                <Trans>View alert</Trans>↗
              </Button>
            </a>
          )}
          <Link href={`/editor/${alert.id}`}>
            {alert.status !== "PUBLISHED" && (
              <Button
                className={styles.btn}
                appearance="ghost"
                color="violet"
                size="xs"
              >
                <Trans>Edit alert</Trans>
                🖉
              </Button>
            )}
          </Link>
          <Link href={`/editor?template=${alert.id}`}>
            <Button
              className={styles.btn}
              appearance="ghost"
              color="violet"
              size="xs"
            >
              <Trans>Use as template for new alert</Trans> &rarr;
            </Button>
          </Link>
        </>
      }
    >
      <p>
        <Trans>Sent</Trans>:{new Date(alertData.sent).toString()}
        <br />
        <Trans>Expires</Trans>: {expiryDate.toString()}
      </p>
      <p>
        <Tag as="span" color="green">
          {alertData.msgType}
        </Tag>
        <Tag as="span" color="green">
          {alertData.status}
        </Tag>
        <Tag as="span" color={colors.urgency[info?.urgency]}>
          {info?.urgency}
        </Tag>
        <Tag as="span" color={colors.certainty[info?.certainty]}>
          {info?.certainty}
        </Tag>
        <Tag as="span" color={colors.severity[info?.severity]}>
          {info?.severity}
        </Tag>
      </p>
    </Panel>
  );
}
