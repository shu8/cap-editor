# Deployment

## Overview

1. Ensure you have the following dependencies installed:

- Docker
- Docker Compose

2. Clone the repo.

3. Create a [`.env`](./.env) file based on the [`.env.example`](./.env.example) file

   !> Make sure you [configure the system entirely](./configuration.md).

4. Edit the `Caddyfile` to map the correct ports to the correct hostnames. You will also need to configure your domain's DNS to point to your server's IP address.

5. Start the Docker containers using the [`docker-compose-prod.yml`](https://github.com/shu8/cap-editor/tree/main/docker-compose-prod.yml) configuration:

   ```bash
   docker-compose -f docker-compose-prod.yml up -d --build
   ```

6. If using Minio (for S3 storage for resources), make sure the access control is configured appropriately.

[Caddy](https://caddyserver.com/) is used as a web server and reverse proxy in the production configuration. The platform will be accessible on port 80 (redirected to HTTPS) and 443, so these ports must be whitelisted in any firewalls.

## Signing Alerts

By default, in production, this system uses Let's Encrypt certificates automatically generated and renewed using Caddy.

If you want to use a different Certificate Authority, you can edit Caddyfile to add the path to your certificate and private key. The filename of the private key **must** be added to the `.env` file under `PRIVATE_KEY_FILENAME`.

You'll also need to update the Docker Compose configuration to share the appropriate directory containing these files.

## Continuous Deployment

All successful builds can be automatically deployed to a hosted instance of the CAP Editor using GitHub Actions.

[The workflow](https://github.com/shu8/cap-editor/blob/main/.github/workflows/deploy.yml) uses the [`Production` GitHub repository environment](https://github.com/shu8/cap-editor/settings/environments), and the following [environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment):

- `HOST`: the hostname of the deployed CAP Editor (which will be SSH'd into)
- `USERNAME`: the user which should be used to SSH into the host
- `PORT`: the SSH port of the host
- `KEY`: the private key of the `USERNAME`

In the home directory of `USERNAME`, the following files should be placed, tweaked as required:

- `docker-compose-prod.yml`
  Ensure the `ghcr.io/shu8/cap-editor` image is used

- `.env`
