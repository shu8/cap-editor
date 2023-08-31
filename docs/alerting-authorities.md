# Alerting Authorities (AAs)

## Registering

There are two ways to onboard users from Alerting Authorities (AAs) into this system:

1. Users from AAs stored in the [WMO Register of Alerting Authorities](https://alertingauthority.wmo.int/) can choose their AA, and an email is sent to the `author` email address stored in the Register to request approval.

   The approver also assigns [the roles](./security.md) for the user.

2. Users from AAs that are not represented in the Register can choose to register as an 'Other' AA, and an email is sent to a central IFRC contact to request approval. The requester must provide the name of their AA.

   The approver must assign [the roles](./security.md) for the user.

   Ideally, AAs should be added to the WMO Register of Alerting Authorities where possible, to reduce the administrative burden on the IFRC.

Users must have provided their name before they can request to join an AA. In most cases, this is done at registration. However, guest users (see below) may not have provided their name during registration.

## Multiple AAs

A user can be part of multiple AAs. In this case, there is a dropdown menu in the UI to switch which AA to use when viewing and creating alerts.

Alerts are always created under a specific AA.

## Guest Users

Verified users in any AA can _share_ any **draft** alerts with external users via their email address using the share button in the Editor UI.

This grants temporary 24-hour edit-only access to a specific draft alert to the provided email address.

Guests must still register with the platform, but are not required to verify against an Alerting Authority.

Guests can be part of other AAs, and still be provided guest access to individual alerts of another AA.

## Edge case: conflicting AA GUID

As of 2023-02-24, the WMO Register of AAs returns 2 AA records with the same GUID:
`urn:oid:2.49.0.0.626.0` and `urn:oid:2.49.0.0.768.0`. These seem to be referring to the same AA based on their country code, email and name.

This is currently handled by simply taking the first record in the list for a given ID.

The best solution would be to fix this in the Register itself.

The records for `urn:oid:2.49.0.0.626.0`:

```xml
<item>
<title>Timor-Leste: National Directorate of Meteorology and Geophysics</title>
<iso:countrycode>TLS</iso:countrycode>
<link>https://alertingauthority.wmo.int/authorities.php?recId=317</link>
<description>A WMO Member [Timor-Leste] identifies National Directorate of Meteorology and Geophysics as an alerting authority for hazard threats of these CAP categories: Met.</description>
<pubDate>Thu, 02 Feb 2023 00:05:12 +0000</pubDate>
<guid>urn:oid:2.49.0.0.626.0</guid>
<author>meteoffice05.tl@gmail.com</author>
<raa:capAlertFeed xml:lang="en">https://cap-sources.s3.amazonaws.com/tl-dnmg-en/rss.xml</raa:capAlertFeed>
<raa:authorityAbbrev>flooding</raa:authorityAbbrev>
</item>

<item>
<title>Timor-Leste: Dirrecão Nacional Meteorologia e Geofisica</title>
<iso:countrycode>TLS</iso:countrycode>
<link>https://alertingauthority.wmo.int/authorities.php?recId=244</link>
<description>A WMO Member [Timor-Leste] identifies Dirrecão Nacional Meteorologia e Geofisica as an alerting authority for hazard threats.</description>
<pubDate>Tue, 13 Dec 2022 23:48:07 +0000</pubDate>
<guid>urn:oid:2.49.0.0.626.0</guid>
<author>meteoffice05.tl@gmail.com</author>
<raa:authorityAbbrev>dnmg</raa:authorityAbbrev>
</item>
```

The records for `urn:oid:2.49.0.0.768.0`:

```xml
<item>
<title>Togo: Direction de la Météorologie Nationale</title>
<iso:countrycode>TGO</iso:countrycode>
<link>https://alertingauthority.wmo.int/authorities.php?recId=188</link>
<description>A WMO Member [Togo] identifies Direction de la Météorologie Nationale as an alerting authority for hazard threats of these CAP categories: Met.</description>
<pubDate>Mon, 21 Nov 2022 06:23:00 +0000</pubDate>
<guid>urn:oid:2.49.0.0.768.0</guid>
<author>wmoraa@wmo.int</author>
<raa:authorityAbbrev>dmn</raa:authorityAbbrev>
</item>

<item>
<title>Togo: Direction Générale de la météorologie Nationale</title>
<iso:countrycode>TGO</iso:countrycode>
<link>https://alertingauthority.wmo.int/authorities.php?recId=316</link>
<description>A WMO Member [Togo] identifies Direction Générale de la météorologie Nationale as an alerting authority for hazard threats of these CAP categories: Met.</description>
<pubDate>Fri, 04 Nov 2022 09:34:50 +0000</pubDate>
<guid>urn:oid:2.49.0.0.768.0</guid>
<author>ablaagb@yahoo.fr</author>
<cap:area>
<cap:polygon>11.5,-0.5 6.0,-0.5 6.0,2.0 11.5,2.0 11.5,-0.5</cap:polygon>
<cap:geocode>
<cap:valueName>iso-3166-1-alpha-2</cap:valueName>
<cap:value>TG</cap:value>
</cap:geocode>
</cap:area>
<georss:box>6.0 -0.5 11.5 2.0</georss:box>
<raa:capAlertFeed xml:lang="fr">https://cap-sources.s3.amazonaws.com/tg-dgmn-fr/rss.xml</raa:capAlertFeed>
<raa:capAlertFeed xml:lang="en">https://cap-sources.s3.amazonaws.com/tg-dgmn-en/rss.xml</raa:capAlertFeed>
<raa:authorityAbbrev>tg-dgmn-fr</raa:authorityAbbrev>
</item>
```
