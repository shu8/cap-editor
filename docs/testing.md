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
