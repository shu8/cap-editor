# Security

There are multiple levels of security in this system.

## User roles

At the highest level, there are three roles:

1. Administrator
   Admins can perform any action under their respective AAs.

2. Editor
   Editors can edit any non-published alert, create new draft/template alerts, but cannot publish any alert.

3. Validator
   Validators can edit and publish any draft alert.

A user can have one or more roles, however there is largely a hierarchy in these roles.

If a user is part of multiple AAs, they can have different roles for each AA ([as assigned to them by their approver](./alerting-authorities.md) during onboarding).

## Authentication

There are two methods of authentication with the system:

1. Using a unique link sent to your email address
   Enter your email address on the login page, and click the temporary link emailed to you in order to login. This link is only valid for a short period of time.

2. Using biometrics or hardware tokens
   Some devices will support biometrics natively (e.g., Windows Hello, Apple Touch ID, Apple Face ID). Some users may also have hardware tokens (e.g., YubiKeys, Google Titan keys).

   After registering, users have the option to register their device with the platform in order to login without their email in future (when using the same device). When visiting the login page, browsers will automatically request authentication via such devices (without requiring a username).

## Onboarding/registering

To be able to create alerts (and potentially publish them, depending on user roles), users must first be verified by their AA via email. This process is outlined in more detail in [Alerting Authorities](./alerting-authorities.md).

## Alert XML Digital Signatures

All published alerts (XML) are digitally signed using [XMLDSIG](https://www.w3.org/TR/xmldsig-core1/) against the TLS private key of the deployed system.

To verify an alert, the public key of the original published alert URL must be extracted from its TLS certificate.

Alerts must always be verified against the current XML, and current TLS public key -- never attempt to verify stale XML alerts, as the signature on the alert, or the public key, may be out of date.

Signed alerts are cached in Redis to reduce load on the server. The cache is cleared when the TLS certificate renews, to ensure the next request triggers re-signing of the alert. This is done via the Caddy event system (see [the the Caddy PR](https://github.com/caddyserver/caddy/pull/4912) and docs: [1](https://github.com/caddyserver/caddy/pull/4984), [2](https://caddyserver.com/docs/caddyfile/options#event-options), [3](https://caddyserver.com/docs/modules/events.handlers.exec)), which executes the [`erase-alert-cache.sh`](https://github.com/shu8/cap-editor/tree/main/erase-alert-cache.sh) script whenever a new certificate is obtained (for any reason).

!> This requires the [`exec` Caddy plugin](https://github.com/mholt/caddy-events-exec) to run the script that clears the cache -- this is installed in [`Dockerfile.caddy`](https://github.com/shu8/cap-editor/tree/main/Dockerfile.caddy) which is used in the [`docker-compose-prod.yml`](https://github.com/shu8/cap-editor/tree/main/docker-compose-prod.yml) configuration.
