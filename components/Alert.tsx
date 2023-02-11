import { Button, Panel, Tag } from "rsuite";
import { Alert as DBAlert } from "@prisma/client";
import { t, Trans } from "@lingui/macro";
import Link from "next/link";
import Image from "next/image";

import styles from "../styles/components/Alert.module.css";
import { CAPV12JSONSchema } from "../lib/types/cap.schema";

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

const generateSocialMediaText = (
  info: NonNullable<CAPV12JSONSchema["info"]>[number] | undefined
) => {
  let text = "";

  if (!info) return text;
  text += info.headline;
  if (info.onset && info.expires) {
    text += ": ";
    text += `${new Date(info.onset).toDateString()} - ${new Date(
      info.expires
    ).toDateString()}`;
  }

  return text;
};

export default function Alert({ alert }: { alert: DBAlert }) {
  const alertData = alert.data as CAPV12JSONSchema;
  const info = alertData.info?.[0];

  const expiryDate = new Date(info?.expires);
  const expired = expiryDate < new Date();
  const socialMediaEncodedUrl = encodeURIComponent(
    new URL(`/feed/${alert.id}`, window.location.origin).toString()
  );
  const socialMediaText = encodeURIComponent(generateSocialMediaText(info));

  return (
    <Panel
      bordered
      header={
        <>
          <strong>{info?.headline}</strong> <i>({info?.category.join(", ")})</i>{" "}
          <a
            className={styles.btn}
            target="_blank"
            href={`/feed/${alert.id}`}
            rel="noreferrer"
          >
            <Button appearance="ghost" color="violet" size="xs">
              <Trans>View alert</Trans> ↗
            </Button>
          </a>
          <Link href={`/editor/${alert.id}`}>
            {alert.status !== "PUBLISHED" && (
              <Button
                className={styles.btn}
                appearance="ghost"
                color="violet"
                size="xs"
              >
                <Trans>Edit alert</Trans> 🖉
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
      <div className={styles.sideBySide}>
        <div className={styles.alertDetails}>
          <p>
            <Trans>Sent</Trans>: {new Date(alertData.sent).toString()}
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

          {alert.status !== "PUBLISHED" && !expired && (
            <p className={styles.socialMediaShareIconsWrapper}>
              <>
                Share on Social Media:
                <div className={styles.socialMediaIconsWrapper}>
                  <a
                    href={`https://facebook.com/sharer/sharer.php?u=${socialMediaEncodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Facebook"
                    className={styles.socialMediaIcon}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                    </svg>
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet/?text=${socialMediaText}&amp;url=${socialMediaEncodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on Twitter"
                    className={styles.socialMediaIcon}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" />
                    </svg>
                  </a>
                  <a
                    href={`whatsapp://send?text=${socialMediaText}%20-%20${socialMediaEncodedUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Share on WhatsApp"
                    className={styles.socialMediaIcon}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z" />
                    </svg>
                  </a>
                </div>
              </>
            </p>
          )}
        </div>

        <Image
          src={`/api/alerts/${alert.id}/image`}
          width={200}
          height={220}
          alt="Alert image"
        />
      </div>
    </Panel>
  );
}
