# XML Feeds

There are 3 different feeds/XML documents exposed in this platform.

## Alerting Authorities feed

This feed is accessible at `/feed`.

It shows all the Alerting Authorities that users have registered with in the system, and a URL to their main alerts feed.

Example:

```xml
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed/</id>
  <title>Current Alerting Authorities</title>
  <updated>2023-02-20T13:40:58.844Z</updated>
  <link rel="self" href="https://example.com/feed"/>
  <entry>
    <id>urn:oid:2.49.0.0.826.0</id>
    <title>United Kingdom of Great Britain and Northern Ireland: Met Office</title>
    <link href="https://example.com/feed/alertingAuthorities/urn:oid:2.49.0.0.826.0"/>
  </entry>
  <entry>
    <id>urn:oid:2.49.0.0.170.1</id>
    <title>Colombia: Instituto de Hidrología, Meteorología y Estudios Ambientales</title>
    <link href="https://example.com/feed/alertingAuthorities/urn:oid:2.49.0.0.170.1"/>
  </entry>
</feed>
```

## Alerts feed (for an Alerting Authority)

This feed is accessible at `/feed/alertingAuthorities/:id`.

This feed is the main feed that lists all published, current, non-expired alerts for the given Alerting Authority, and URLs to the actual alert document.

Each entry contains an `updated` field which shows when the alert was last updated. In almost all cases, this should only be updated when the signature changes as a result of TLS certificate renewal.

Example:

```xml
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>https://example.com/feed/alertingAuthorities/urn:oid:2.49.0.0.826.0</id>
  <title>Alerts for United Kingdom of Great Britain and Northern Ireland: Met Office</title>
  <updated>2023-02-20T13:44:26.273Z</updated>
  <author>
    <name>United Kingdom of Great Britain and Northern Ireland: Met Office</name>
    <email>[author]@metoffice.gov.uk</email>
  </author>
  <link rel="self" href="https://example.com/feed/alertingAuthorities/urn:oid:2.49.0.0.826.0"/>
  <entry>
    <id>1c7660a5-cd6b-4b80-9d39-8b1b40708605</id>
    <title>Heavy flooding in North West England</title>
    <link href="https://example.com/feed/1c7660a5-cd6b-4b80-9d39-8b1b40708605"/>
    <updated>2023-02-20T13:44:16.868Z</updated>
    <published>2023-02-20T13:44:13.000Z</published>
  </entry>
</feed>
```

## Alert

This document is accessible at `/feed/:id`.

All alerts are [signed with the current TLS certificate](security.md).

Example:

```xml
<alert xmlns="urn:oasis:names:tc:emergency:cap:1.2">
  <identifier>1c7660a5-cd6b-4b80-9d39-8b1b40708605</identifier>
  <sender>[author]@metoffice.gov.uk</sender>
  <sent>2023-02-20T13:44:13+00:00</sent>
  <status>Actual</status>
  <msgType>Alert</msgType>
  <scope>Public</scope>
  <info>
    <language>en</language>
    <category>Geo</category>
    <event>Test</event>
    <responseType>Shelter</responseType>
    <urgency>Immediate</urgency>
    <severity>Severe</severity>
    <certainty>Likely</certainty>
    <onset>2023-02-23T00:00:00+00:00</onset>
    <expires>2023-03-12T02:49:59+00:00</expires>
    <senderName>United Kingdom of Great Britain and Northern Ireland: Met Office</senderName>
    <headline>Heavy flooding in North West England</headline>
    <description>Description</description>
    <instruction>Instruction</instruction>
    <web>https://example.com/feed/1c7660a5-cd6b-4b80-9d39-8b1b40708605</web>
    <contact>[author]@metoffice.gov.uk</contact>
    <area>
      <areaDesc>England</areaDesc>
      <polygon>49.8858833313549 -6.36867904666016</polygon>
      <polygon>49.8858833313549 1.75900208943311</polygon>
      <polygon>55.8041437929974 1.75900208943311</polygon>
      <polygon>55.8041437929974 -6.36867904666016</polygon>
      <polygon>49.8858833313549 -6.36867904666016</polygon>
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
        <ds:DigestValue>m9Nt8kbi5ntEcYVBMZULUkRqWUabPGQH7O3oIqMNkXX8/pq3bKfdLz/l4ZBxNGncjcGLh2BslfxJ/PGNeM3sZg==</ds:DigestValue>
      </ds:Reference>
    </ds:SignedInfo>
    <ds:SignatureValue>kHvZWaGoHbYc0RX34unDO4Y7qXwsAuhAUzoP+QqNE7QLYeKbBewjWcuVm7soa/X/FSxzdmNtF0J+nEkdksgADw==</ds:SignatureValue>
  </ds:Signature>
</alert>
```
