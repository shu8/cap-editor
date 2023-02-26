# Testing

This system has various types of tests.

## API

API tests are stored in [`tests/api`](https://github.com/shu8/cap-editor/tree/main/tests/api) using [Jest](https://jestjs.io/).

To run API tests, run `pnpm test:api`. This also outputs the overall coverage.

## Frontend

The CAP Editor component is the core component tested in the frontend due to its complexities and size.

The frontend tests are stored in [`tests/frontend`](https://github.com/shu8/cap-editor/tree/main/tests/frontend) and use [Jest](https://jestjs.io/) and the [Testing Library (React)](https://testing-library.com/).

To run the frontend tests, run `pnpm test:frontend`. This also outputs the overall coverage.

?> Jest coverage for React does not seem 100% accurate, so be careful when analysing the coverage report.

## End-to-End (E2E)

The entire system is tested in a headless browser ([Chromium](https://www.chromium.org/chromium-projects/)) using [Puppeteer](https://pptr.dev/) and [Jest](https://jestjs.io/). These tests are stored in [`tests/e2e`](https://github.com/shu8/cap-editor/tree/main/tests/frontend).

These tests aim to test the entire integration of the platform, by clicking on elements and asserting that certain content is shown on-screen to users.

?> The E2E tests are inherently more brittle than the API and frontend tests, due to the reliance on the content rendered on the frontend. Consequently, significant updates to the frontend may require these tests to be updated.
