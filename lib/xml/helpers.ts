import { Alert } from ".prisma/client";
import { XMLBuilder } from "fast-xml-parser";
import { Capgen } from 'capgen';

const CAPGenerator = new Capgen({ strictMode: false, comment: false, xmlOptions: { prettyPrint: true } });

export const formatAlertAsXML = (alert: Alert) => {
  // console.log(alerts[0].data.info[0].area[0].polygon.flat(2));
  const info = alert?.data?.info;
  if (info) {
    for (let j = 0; j < info.length; j++) {
      info[j].area?.forEach(a => {
        if (typeof a.polygon !== 'string') {
          a.polygon = [a.polygon.flat(2).join(' ')];
        }
      });
    }
  }

  return CAPGenerator.createUsing(alert.data);

  return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.id}</identifier>
  <sender>${alert.data.sender}</sender>
  <sent>${alert.data.sent}</sent>
  <status>${alert.data.status}</status>
  <msgType>${alert.data.msgType}</msgType>
  <scope>${alert.data.scope}</scope>
  <info>
    <category>${alert.data.info.category}</category>
    <event>${alert.data.info.event}</event>
    <urgency>${alert.data.info.urgency}</urgency>
    <severity>${alert.data.info.severity}</severity>
    <certainty>${alert.data.info.certainty}</certainty>
    <area>
      <areaDesc>${alert.data.info.areaDesc}</areaDesc>
    </area>
  </info>
</alert>
  `;
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
