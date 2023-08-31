# Configuration

This system is intended to be deployable by simply starting the Docker containers. However, there is some one-time configuration required, through a `.env` file which should be placed into the project root (alongside the `docker-compose-prod.yml` file).

?> You can copy the `.env.example` file into a new `.env` file, and then edit the defaults, to make configuration easier.

## Databases

These settings are used in the Docker Compose configuration to configure the databases, and the Next.js server when connecting to the databases.

##### `POSTGRES_USERNAME`

Example: `cap-editor`.

This is the username that the PostgreSQL database should be configured to use.

##### `POSTGRES_PASSWORD`

Example: `khnGQYGwOBaUwwYCMpUVitAVCDOcVZsw`.

This is the password that the PostgreSQL database should be configured to use.

##### `POSTGRES_DATABASE`

Example: `cap-editor`.

This is the database name that the PostgreSQL database should be configured to use.

##### `DATABASE_URL`

Example: `postgresql://USERNAME:PASSWORD@HOST:PORT/DBNAME?schema=public`.

This is the PostgreSQL Connection URL that should be used to connect to the database.

When deploying in production, the Docker internal network allows you to connect to containers using their container name as the hostname. Therefore, in production, the `host` should usually be `db`, and in development it should be `localhost`.

##### `REDIS_HOST`

Example: `redis`.

This is the hostname of the Redis server. When deploying in production, the Docker internal network allows you to connect to containers using their container name as the hostname.

Therefore, in production, this should usually be `redis`. In development, this should usually be `localhost` (as Redis is in Docker but the Next.js app is on your host).

## S3 (Uploaded resources)

The CAP Editor allows users to upload images to use as Resource entries for CAP alerts. These are stored in any S3-compatible storage space.

By default, the Docker Compose configuration includes [Minio](https://min.io/), an S3-compatible data store than is hosted alongside the CAP Editor.

Any other S3-compatible data store can be used (e.g., AWS S3, Azure, Backblaze), as long as the following configuration options are set.

##### `RESOURCES_S3_BASE_URL`

Example: `localhost`.

This is the URL of the S3 API that should be used to upload files. If using Minio locally, this should be `localhost` in development, or the Minio Docker container's name in production (e.g., `minio`).

If using an external S3 provider, it should be the URL they give.

##### `RESOURCES_S3_PORT`

Example: `9000`.

This is the port that the S3 API is listening on. If using an external S3 provider, this would usually be `80` or `443`.

##### `RESOURCES_S3_ACCESS_KEY`

Example: `cap-resources`.

This is the username of the user who has permission to write to the S3 bucket.

##### `RESOURCES_S3_SECRET_KEY`

Example: `khnGQYGwOBaUwwYCMpUVitAVCDOcVZsw`.

This is the password of the user who has permission to write to the S3 bucket.

##### `RESOURCES_S3_BUCKET_NAME`

Example: `resources`.

This is the name of the S3 bucket in which resources should be uploaded to.

**Important**: access control must be configured to enable public read-only access.

##### `RESOURCES_S3_BASE_PUBLIC_URL`

Example: `https://s3.domain.com`.

This is the public S3 URL. When hosting Minio, this can be a subdomain which has the Minio port forwarded to it. When using an external S3 provider, this will usually be the same as `RESOURCES_S3_BASE_URL`.

##### `RESOURCES_S3_IS_LOCAL`

Example: `true`.

This should be `true` if using e.g., a local instance of Minio in Docker, and `false` in all other cases.

## Email

To configure email, you need SMTP credentials for a mail server.

You can use transactional email providers like [Mailjet](https://www.mailjet.com/), [Mailgun](https://www.mailgun.com/), [Sendgrid](https://sendgrid.com/), etc. Many of these have a free tier allowing a certain number of emails per month for free. Most of the below configuration options will be provided to you by your email provider.

The [development Docker Compose](https://github.com/shu8/cap-editor/tree/main/docker-compose.yml) configuration includes [Mailhog](https://github.com/mailhog/MailHog), a dummy SMTP server that catches all outgoing emails and presents them in a user-friendly UI for ease in development.

##### `EMAIL_SERVER_HOST`

Example (production): `smtp.mailgun.org`

Example (development with Mailhog): `localhost`

##### `EMAIL_SERVER_PORT`

Example: `1025`

##### `EMAIL_SERVER_USER`

Example: `username`

##### `EMAIL_SERVER_PASSWORD`

Example: `password`

##### `EMAIL_FROM`

Example: `cap-editor@example.com`

## Security

##### `NEXTAUTH_SECRET`

Example: `khnGQYGwOBaUwwYCMpUVitAVCDOcVZsw`.

This should be a secret used by NextAuth used to sign and encrypt JWTs.

##### `TLS_DIRECTORY`

Example: `/tls`

This is the path to the directory in which the private key for the TLS certificate used by the system is stored in.

Note that when using the [production Docker Compose](https://github.com/shu8/cap-editor/tree/main/docker-compose-prod.yml) configuration, the TLS certificate is managed by Caddy, which is then read-only mounted to the host to the `./docker-volumes/caddy/data` directory. This host directory is then also read-only mounted within the Next.js container at the path `/tls`, so that the two containers can share the private key.

##### `PRIVATE_KEY_FILENAME`

Example: `example.com.key`

This is the filename of the private key for the TLS certificate used by the system.

##### `WEBAUTHN_RELYING_PARTY_NAME`

Example: `CAP Editor`

This should represent the name of the application. If it is a specific deployment of the CAP Editor, this should be included.

##### `WEBAUTHN_RELYING_PARTY_ID`

Example: `example.com`

This should be the domain name that the system is deployed on.

##### `WEBAUTHN_ORIGIN`

Example: `https://example.com`

This should be the full origin URL (inc. protocol, host, port) that the system is deployed on.

Note, in development this should include the port e.g., `http://localhost:3000`.

## Other

##### `WHAT_NOW_API_KEY`

Example: `qV3lFYVWUZGjsZNEx6kIXT5P9LbpKj3X`

This should be an API key generated by the [WhatNow Service](https://whatnow.preparecenter.org/).

##### `IFRC_AA_VERIFIER_EMAIL`

Example: `alerting-authority-verifier@ifrc.org`

This should be an email address which receives verification requests when users attempt to register with the system as an "Other" Alerting Authority. This contact should have the capability and authorisation to verify whether the requesting user is part of an Alerting Authority that is not already within the WMO Register of Alerting Authorities.

For more details on this process, see [Alerting Authorities](./alerting-authorities.md).

##### `BASE_URL`

Example: `https://example.com`.

This is the base URL that the system is deployed on.
