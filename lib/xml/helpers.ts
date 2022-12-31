import { Alert } from ".prisma/client";
import { XMLBuilder } from "fast-xml-parser";
import { Capgen } from 'capgen';

const builder = new XMLBuilder({ format: true, ignoreAttributes: false, attributeNamePrefix: '@_' });
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
    let xmlAlert = CAPGenerator.createUsing(alert.data as any) as string;
    const newlineIndex = xmlAlert.indexOf('\n');
    return xmlAlert.substring(0, newlineIndex) +
      '<?xml-stylesheet type="text/xsl" href="/cap-style.xsl" ?>' +
      xmlAlert.substring(newlineIndex);
  } catch (err) {
    return '';
  }
};

export const formatFeedAsXML = (alerts: Alert[]) => {
  const feed = builder.build({
    feed: {
      '@_xmlns': 'http://www.w3.org/2005/Atom',
      id: `${process.env.DOMAIN}/feed`,
      title: 'TODO',
      updated: new Date().toISOString(),
      author: {
        name: 'TODO',
        email: 'TODO',
        uri: 'TODO'
      },
      link: {
        '@_rel': 'self',
        '@_href': `https://${process.env.DOMAIN}/feed`
      },
      subtitle: 'TODO',
      rights: 'TODO',
      entry: alerts.map(a => ({
        id: a.id,
        title: a.data?.info?.[0]?.headline ?? 'Alert',
        link: { '@_href': `https://${process.env.DOMAIN}/feed/${a.id}` },
        // TODO: this should equal time when signature last changed
        updated: 'TODO'
      }))
    }
  });

  return feed;
};
