# Testing

This system has various types of tests. Continuous Integration has been configured in GitHub Actions to run all tests on every Pull Request and every push to `main`. The GitHub Actions workflows can be found in [`.github/workflows`](https://github.com/shu8/cap-editor/tree/main/.github/workflows).

## API

API tests are stored in [`tests/api`](https://github.com/shu8/cap-editor/tree/main/tests/api) using [Jest](https://jestjs.io/).

### Running locally

1. Close any existing Docker containers

   ```bash
   docker-compose down
   # Or `docker-compose -f file-path.yml down` if you have used a different file
   ```

2. Start the API tests Docker container
   This is currently only a PostgreSQL container with no persistence, so API tests can run without interfering with your local database

   ```bash
   docker-compose -f docker-compose-test-api.yml up -d
   ```

3. Run API tests

   ```bash
   pnpm test:api
   # Or npm run test:api
   ```

   This also outputs the overall coverage.

## Frontend

The CAP Editor component is the core component tested in the frontend due to its complexities and size.

The frontend tests are stored in [`tests/frontend`](https://github.com/shu8/cap-editor/tree/main/tests/frontend) and use [Jest](https://jestjs.io/) and the [Testing Library (React)](https://testing-library.com/).

### Running locally

1. Run frontend tests

   ```bash
   pnpm test:frontend
   # Or npm run test:frontend
   ```

   This also outputs the overall coverage.

?> Jest coverage for React does not seem 100% accurate, so be careful when analysing the coverage report.

## End-to-End (E2E)

The entire system is tested in a headless browser ([Chromium](https://www.chromium.org/chromium-projects/)) using [Puppeteer](https://pptr.dev/) and [Jest](https://jestjs.io/). These tests are stored in [`tests/e2e`](https://github.com/shu8/cap-editor/tree/main/tests/frontend).

These tests aim to test the entire integration of the platform, by clicking on elements and asserting that certain content is shown on-screen to users.

These tests hook into [Mailhog's API](https://github.com/mailhog/MailHog) to extract emails sent by the system. This is primarily used to get the login link to authenticate the user in the browser.

### Running locally

1. Close any existing Docker containers

   ```bash
   docker-compose down
   # Or `docker-compose -f file-path.yml down` if you have used a different file
   ```

2. Start the E2E tests Docker containers
   This is currently a Redis, Mailhog, and PostgreSQL containers, all with no persistence, so E2E tests can run without interfering with your local database

   ```bash
   docker-compose -f docker-compose-test-e2e.yml up -d
   ```

3. Start the Next.js server in a new shell

   ```bash
   NODE_ENV=test pnpm build && pnpm start
   NODE_ENV=test pnpm dev
   ```

4. Run API tests

   ```bash
   pnpm test:e2e
   ```

   This also outputs the overall coverage.

?> The E2E tests are inherently more brittle than the API and frontend tests, due to the reliance on the content rendered on the frontend. Consequently, significant updates to the frontend may require these tests to be updated.
