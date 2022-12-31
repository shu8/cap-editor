import { Alert } from ".prisma/client";
import { XMLBuilder } from "fast-xml-parser";
import { Capgen } from 'capgen';

const CAPGenerator = new Capgen({ strictMode: false, comment: false, xmlOptions: { prettyPrint: true } });

export const formatAlertAsXML = (alert: Alert): string => {
  const info = alert?.data?.info;
  if (info) {
    for (let i = 0; i < info.length; i++) {
      for (let j = 0; j < info[i].area.length; j++) {
        const area = info[i].area[j];
        if (typeof area.polygon !== 'undefined') {
          area.polygon = area.polygon.map(p => p.join(' '));
        }
      }
    }
  }

  try {
    return CAPGenerator.createUsing(alert.data as any) as string;
  } catch (err) {
    return '';
  }
};

export const formatFeedAsXML = (alerts: Alert[]) => {
  return `<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${process.env.DOMAIN}/feed</id>
  <title>TODO</title>
  <updated>${new Date().toISOString()}</updated>
  <generator>TODO</generator>
  <author>
    <name>TODO</name>
    <email>TODO</email>
    <uri>TODO</uri>
  </author>
  <link rel="alternate" href="${process.env.DOMAIN}/alerts"/>
  <subtitle>TODO</subtitle>
  <rights>TODO</rights>
  ${alerts.map(alert => `<entry>
    <id>${alert.id}</id>
    <title>${alert.data.msgType}, ${alert.data.info.severity} - ${alert.data.info.event}</title>
    <updated>${alert.data.sent}</updated>
    <link rel="related" type="application/cap+xml" href="${process.env.DOMAIN}/feed/${alert.id}"/>
  </entry>`).join('\n')}
</feed>
  `;
};
