# Development

!> This documentation uses [PNPM](https://pnpm.io/) as a Node package manager. It is strongly recommended to use PNPM, however if you use NPM, Yarn, or a different package manager, you will need to alter the commands as appropriate.

## Overview

1. Ensure you have the following dependencies installed:

- Node v18+
- PNPM
- Docker
- Docker Compose

2. Clone the repo.

3. Create a [`.env`](./.env) file based on the [`.env.example`](./.env.example) file

   !> Make sure you [configure the system entirely](./configuration.md).

4. Start the Docker containers (the development configuration at [`./docker-compose.yml`](./docker-compose.yml) includes [Mailhog](https://github.com/mailhog/MailHog), a fake SMTP server for easier development)

```bash
docker-compose up -d
```

4. Install the Node dependencies:

```bash
pnpm install
```

5. Run the database migrations:

```bash
pnpm db:migrate
```

6. Run the Next.js development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Signing Alerts

If you wish to sign alerts during development, you can either:

1. Set up HTTPS locally, or

2. Generate a key-pair using the command below and hen update `TLS_DIRECTORY=./` and `PRIVATE_KEY_FILENAME=cap-editor` values in the `.env` file

   ```bash
   ssh-keygen -m PKCS8 -t ecdsa -f $(pwd)/cap-editor
   ```

   _Note: a PKCS#8-formatted key is required._

   Signed alerts are cached, so if you have added this configuration after an alert was cached, you will need to empty the Redis cache (`FLUSHDB` inside `redis-cli` in the Redis Docker container is the easiest option in development environments).
