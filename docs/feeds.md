# XML Feeds

There are 3 different **RSS** feeds/XML documents exposed in this platform.

## Alerting Authorities feed

This feed is accessible at `/feed`.

It shows all the Alerting Authorities that users have registered with in the system, and a URL to each of the AA's per-language feeds.

Example:

```xml
<rss version="2.0">
  <channel>
    <title>Alerting Authoritiy feeds</title>
    <description>Public hazard and emergency Common Alerting Protocol (CAP) alerts for Alerting Authorities</description>
    <link rel="self">https://example.com/feed</link>
    <lastBuildDate>Thu, 31 Aug 2023 12:21:50 GMT</lastBuildDate>
    <item>
      <guid isPermaLink="false">urn:oid:2.49.0.0.170.1</guid>
      <title>Colombia: Instituto de Hidrología, Meteorología y Estudios Ambientales</title>
      <description>CAP Alerts for Colombia: Instituto de Hidrología, Meteorología y Estudios Ambientales</description>
      <link xml:lang="eng" hreflang="eng">https://example.com/feed/alertingAuthorities/urn:oid:2.49.0.0.170.1/eng/rss.xml</link>
    </item>
  </channel>
</rss>
```

## Alerts feed (for an Alerting Authority)

This feed is accessible at `/feed/alertingAuthorities/:id/:language/rss.xml`.

This feed is the main feed of an AA that lists all their published, non-expired alerts, and URLs to the actual alert document.

Each item contains an `pubDate` field which shows when the alert was last updated. In almost all cases, this should only be updated when the signature changes as a result of TLS certificate renewal.

Example:

```xml
<rss version="2.0">
  <channel>
    <title>CAP alerts for Colombia: Instituto de Hidrología, Meteorología y Estudios Ambientales (eng)</title>
    <link rel="self">https://example.com/feed/alertingAuthorities/urn:oid:2.49.0.0.170.1/eng/rss.xml</link>
    <lastBuildDate>Thu, 31 Aug 2023 12:23:48 GMT</lastBuildDate>
    <item>
      <guid>https://example.com/feed/46004020-2f23-42c9-b784-a8867e8d05a4</guid>
      <title>Inundaciones en Antioquia</title>
      <link>https://example.com/feed/46004020-2f23-42c9-b784-a8867e8d05a4</link>
      <pubDate>Thu, 31 Aug 2023 08:54:49 GMT</pubDate>
    </item>
  </channel>
</rss>
```

## Alert

This document is accessible at `/feed/:id`.

All alerts are [signed with the current TLS certificate](security.md).

There are 2 custom parameters added to all Alerts:

- `CANONICAL_URL`

  This is set to the URL of the original Alert. This is used when consumers of the feed want to verify an Alert. More details can be found in the [Security](./security.md) section.

- `MULTI_LANGUAGE_GROUP_ID`

  This is a unique UUID set for alerts, intended to group alerts that differ only in their language. The interface offers an option to "draft in new language". Using this option will copy an Alert's `MULTI_LANGUAGE_GROUP_ID` for a new Alert.

Example:

```xml
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>urn:oid:2.49.0.0.170.1.2023.08.31.08.53.42</identifier>
  <sender>wmoraa@wmo.int</sender>
  <sent>2023-08-31T08:53:42-05:00</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <language>eng</language>
    <category>Met</category>
    <event>Inundaciones</event>
    <responseType>Monitor</responseType>
    <urgency>Expected</urgency>
    <severity>Severe</severity>
    <certainty>Possible</certainty>
    <onset>2023-08-31T02:00:00-05:00</onset>
    <expires>2023-09-02T10:46:15-05:00</expires>
    <senderName>Colombia: Instituto de Hidrología, Meteorología y Estudios Ambientales</senderName>
    <headline>Headline</headline>
    <description>Description</description>
    <instruction>Instruction.</instruction>
    <parameter>
      <valueName>CANONICAL_URL</valueName>
      <value>https://example.com/feed/urn:oid:2.49.0.0.170.1.2023.08.31.08.53.42</value>
    </parameter>
    <parameter>
      <valueName>MULTI_LANGUAGE_GROUP_ID</valueName>
      <value>3cad10ca-d46d-4bc1-8591-658c4ba37fb1</value>
    </parameter>
    <area>
      <areaDesc>Antioquia</areaDesc>
      <polygon>5.429,-77.115 5.429,-73.867 8.867,-73.867 8.867,-77.115 5.429,-77.115</polygon>
    </area>
  </info>
  <ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
    <ds:SignedInfo>
      <ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
      <ds:SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha512"/>
      <ds:Reference>
        <ds:Transforms>
          <ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
          <ds:Transform Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
        </ds:Transforms>
        <ds:DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha512"/>
        <ds:DigestValue>HuaYVyyw+TdBj7vDmcmADFg/Q5VauKbkAIHxPMSbGTIBluyRixWcQIg0p5UAqpck65bfc1Lk/cPWdafsqmvXQA==</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>/VDyioZfmF412xwBrwNSVRnE+CWaiMnO2bp93uv4Zxhcznj2JcaUTjrB9/xWDCTaOuY/3dr2xoDQhIU6pOeMnA==</ds:SignatureValue>
  </ds:Signature>
</alert>
```
