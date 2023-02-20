# Architecture

## Overview

This is a [Next.js](https://nextjs.org/) project.

In the below architecture diagram, the _feed server_ is this Next.js app.

<p align="center">
  <img src="images/architecture.png" alt="System Architecture" width="70%" align="center">
</p>

For more details about:

- the CAP Editor (UI), see the [Editor](./editor.md) documentation
- development, see the [Development](./development.md) documentation
- deployment, see the [Deployment](./deployment.md) documentation
- configuration, see the [Configuration](./configuration.md) documentation

Other aspects of the system can be found via the navigation bar on the left.

## API

This Next.js app includes various [API endpoints](https://nextjs.org/docs/api-routes/introduction) stored in the [`pages/api`](../pages/api) directory. These files are mapped to the URL `/api/*`.

!> Some endpoints have been mapped to more user-friendly URLs via the [`next.config.js`](../next.config.js) file. For example, `/feed` is internally mapped to `/api/alerts`.
