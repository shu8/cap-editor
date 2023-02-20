# Alerting Authorities (AAs)

## Registering

There are two ways to onboard users from Alerting Authorities (AAs) into this system:

1. Users from AAs stored in the [WMO Register of Alerting Authorities](https://alertingauthority.wmo.int/) can choose their AA, and an email is sent to the `author` email address stored in the Register to request approval.

   The approver also assigns [the roles](./security.md) for the user.

2. Users from AAs that are not represented in the Register can choose to register as an 'Other' AA, and an email is sent to a central IFRC contact to request approval.

   The approver must assign [the roles](./security.md) for the user, and provide a name for the AA.

   Ideally, AAs should be added to the WMO Register of Alerting Authorities where possible, to reduce the administrative burden on the IFRC.

Users must have provided their name before they can request to join an AA. In most cases, this is done at registration. However, guest users (see below) may not have provided their name during registration.

## Multiple AAs

A user can be part of multiple AAs. In this case, there is a dropdown menu in the UI to switch which AA to use when viewing and creating alerts.

Alerts are always created under a specific AA.

## Guest Users

Verified users in any AA can _share_ any **draft** alerts with external users via their email address using the share button in the Editor UI.

This grants temporary 24-hour edit-only access to specific alerts to the provided email address.

Guests must still register with the platform, but are not required to verify against an Alerting Authority.

Guests can be part of other AAs, and still be provided guest access to individual alerts of another AA.
