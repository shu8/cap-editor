import { Alert } from ".prisma/client";
import { Capgen } from "capgen";
import { XMLBuilder } from "fast-xml-parser";

import { REDIS_PREFIX_SIGNED_ALERTS } from "../constants";
import redis from "../redis";
import { CAPV12JSONSchema } from "../types/cap.schema";
import { UserAlertingAuthority } from "../types/types";

const builder = new XMLBuilder({
  format: true,
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});
const CAPGenerator = new Capgen({
  strictMode: false,
  comment: false,
  xmlOptions: { prettyPrint: true },
});

export const formatAlertAsXML = (alertData: CAPV12JSONSchema): string => {
  const info = alertData.info;
  if (info) {
    for (let i = 0; i < info.length; i++) {
      if (!info[i].area) continue;

      for (let j = 0; j < info[i].area!.length; j++) {
        const area = info[i].area![j];
        area.areaDesc = area.areaDesc.replace("custom-", "");
        if (typeof area.polygon !== "undefined") {
          area.polygon = area.polygon.map((p: number[]) => p.join(" ")) as any;
        }
      }
    }
  }

  try {
    let xmlAlert = CAPGenerator.createUsing(alertData as any) as string;
    const newlineIndex = xmlAlert.indexOf("\n");
    return (
      xmlAlert.substring(0, newlineIndex) +
      '<?xml-stylesheet type="text/xsl" href="/alert-style.xsl" ?>' +
      xmlAlert.substring(newlineIndex)
    );
  } catch (err) {
    return "";
  }
};

export const formatAlertingAuthorityFeedAsXML = async (
  alertingAuthority: Pick<UserAlertingAuthority, "id" | "name">,
  language: string,
  alerts: Alert[]
) => {
  const entries = [];
  const numAlerts = alerts.length;
  for (let i = 0; i < numAlerts; i++) {
    const alert = alerts[i];
    const data = alert.data as CAPV12JSONSchema;
    const lastSignedAt = await redis.HGET(
      `${REDIS_PREFIX_SIGNED_ALERTS}:${alert.id}`,
      "last_signed_at"
    );
    entries.push({
      guid: `${process.env.BASE_URL}/feed/${alert.id}`,
      title: data.info?.[0]?.headline ?? "Alert",
      link: `${process.env.BASE_URL}/feed/${alert.id}`,
      pubDate: lastSignedAt
        ? new Date(+lastSignedAt).toUTCString()
        : new Date().toUTCString(),
    });
  }

  const url = `${process.env.BASE_URL}/feed/alertingAuthorities/${alertingAuthority.id}/${language}/rss.xml`;
  const feed = builder.build({
    rss: {
      "@_version": "2.0",
      channel: {
        title: `CAP alerts for ${alertingAuthority.name} (${language})`,
        link: {
          "@_rel": "self",
          "#text": url,
        },
        lastBuildDate: new Date().toUTCString(),
        item: entries,
      },
    },
  });

  return feed;
};

export const formatAlertingAuthoritiesAsXML = (
  alertingAuthorities: {
    id: string;
    title: string;
    languages: string[];
  }[]
) => {
  const entries = alertingAuthorities
    .filter((aa) => aa.languages.length)
    .map((aa) => ({
      guid: { "@_isPermaLink": false, "#text": aa.id },
      title: aa.title,
      description: `CAP Alerts for ${aa.title}`,
      link: aa.languages.map((lang) => ({
        "@_xml:lang": lang,
        "@_hreflang": lang,
        "#text": `${process.env.BASE_URL}/feed/alertingAuthorities/${aa.id}/${lang}/rss.xml`,
      })),
    }));

  const feed = builder.build({
    rss: {
      "@_version": "2.0",
      channel: {
        title: `Alerting Authoritiy feeds`,
        description:
          "Public hazard and emergency Common Alerting Protocol (CAP) alerts for Alerting Authorities",
        link: {
          "@_rel": "self",
          "#text": `${process.env.BASE_URL}/feed`,
        },
        lastBuildDate: new Date().toUTCString(),
        item: entries,
      },
    },
  });

  return feed;
};
