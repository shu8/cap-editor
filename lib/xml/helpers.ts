import { Alert, AlertingAuthority } from ".prisma/client";
import { Capgen } from "capgen";
import { XMLBuilder } from "fast-xml-parser";

import { REDIS_PREFIX_SIGNED_ALERTS } from "../constants";
import redis from "../redis";
import { CAPV12JSONSchema } from "../types/cap.schema";

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

export const formatAlertAsXML = (alert: Alert): string => {
  const info = (alert.data as CAPV12JSONSchema).info;
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
    let xmlAlert = CAPGenerator.createUsing(alert.data as any) as string;
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
  alertingAuthority: Pick<AlertingAuthority, "author" | "id" | "name">,
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
      id: alert.id,
      title: data.info?.[0]?.headline ?? "Alert",
      link: {
        "@_href": `${process.env.BASE_URL}/feed/${alert.id}`,
      },
      updated: lastSignedAt
        ? new Date(+lastSignedAt).toISOString()
        : new Date().toISOString(),
      published: new Date(data.sent).toISOString(),
    });
  }

  const feed = builder.build({
    feed: {
      "@_xmlns": "http://www.w3.org/2005/Atom",
      id: `${process.env.BASE_URL}/feed/alertingAuthorities/${alertingAuthority.id}`,
      title: `Alerts for ${alertingAuthority.name}`,
      updated: new Date().toISOString(),
      author: {
        name: alertingAuthority.name,
        email: alertingAuthority.author,
      },
      link: {
        "@_rel": "self",
        "@_href": `${process.env.BASE_URL}/feed/alertingAuthorities/${alertingAuthority.id}`,
      },
      entry: entries,
    },
  });

  return feed;
};

export const formatAlertingAuthoritiesAsXML = (
  alertingAuthorities: AlertingAuthority[]
) => {
  const entries = [];
  for (let i = 0; i < alertingAuthorities.length; i++) {
    const aa = alertingAuthorities[i];
    entries.push({
      id: aa.id,
      title: aa.name,
      link: {
        "@_href": `${process.env.BASE_URL}/feed/alertingAuthorities/${aa.id}`,
      },
    });
  }

  const feed = builder.build({
    feed: {
      "@_xmlns": "http://www.w3.org/2005/Atom",
      id: `${process.env.BASE_URL}/feed/`,
      title: `Current Alerting Authorities`,
      updated: new Date().toISOString(),
      link: {
        "@_rel": "self",
        "@_href": `${process.env.BASE_URL}/feed`,
      },
      entry: entries,
    },
  });

  return feed;
};
