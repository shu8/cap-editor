# Deployment

## Overview

1. Ensure you have the following dependencies installed:

- Docker
- Docker Compose

2. Create a [`.env`](./.env) file based on the [`.env.example`](./.env.example) file

   !> Make sure you [configure the system entirely](./configuration.md).

3. Start the Docker containers using the [`docker-compose-prod.yml`](../docker-compose-prod.yml) configuration:

   ```bash
   docker-compose -f docker-compose-prod.yml up -d --build
   ```

[Caddy](https://caddyserver.com/) is used as a web server and reverse proxy in the production configuration. The platform will be accessible on port 80 (redirected to HTTPS) and 443, so these ports must be whitelisted in any firewalls.

## Signing Alerts

By default, in production, this system uses Let's Encrypt certificates automatically generated and renewed using Caddy.

If you want to use a different Certificate Authority, you can edit Caddyfile to add the path to your certificate and private key. The filename of the private key **must** be added to the `.env` file under `PRIVATE_KEY_FILENAME`.

You'll also need to update the Docker Compose configuration to share the appropriate directory containing these files.
