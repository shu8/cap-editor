export const formatAlertAsXML = (alert) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>${alert.id}</identifier>
  <sender>${alert.sender}</sender>
  <sent>${alert.sent}</sent>
  <status>${alert.status}</status>
  <msgType>${alert.msgType}</msgType>
  <scope>${alert.scope}</scope>
  <info>
    <category>${alert.info.category}</category>
    <event>${alert.info.event}</event>
    <urgency>${alert.info.urgency}</urgency>
    <severity>${alert.info.severity}</severity>
    <certainty>${alert.info.certainty}</certainty>
    <area>
      <areaDesc>${alert.info.areaDesc}</areaDesc>
    </area>
  </info>
</alert>
  `;
}

export const formatFeedAsXML = alerts => {
  return `<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://cap-xml.prd.defra.cloud/messages.atom</id>
  <title>TODO</title>
  <updated>${new Date().toISOString()}</updated>
  <generator>TODO</generator>
  <author>
    <name>TODO</name>
    <email>TODO</email>
    <uri>TODO</uri>
  </author>
  <link rel="alternate" href="TODO"/>
  <subtitle>TODO</subtitle>
  <rights>TODO</rights>
  ${alerts.map(alert => `<entry>
    <id>${alert._id}</id>
    <title>${alert.msgType}, ${alert.info.severity} - ${alert.info.event}</title>
    <updated>${alert.sent}</updated>
    <link rel="related" type="application/cap+xml" href="${process.env.DOMAIN}/alerts/${alert.id}"/>
  </entry>`)}
</feed>
  `;
}
