# CAP Editor

[![Backend (API) Tests status](https://github.com/shu8/cap-editor/actions/workflows/test-backend-api.yml/badge.svg)](https://github.com/shu8/cap-editor/actions/workflows/test-backend-api.yml)
[![Frontend (React) Tests status](https://github.com/shu8/cap-editor/actions/workflows/test-frontend.yml/badge.svg)](https://github.com/shu8/cap-editor/actions/workflows/test-frontend.yml)
[![End-to-end tests](https://github.com/shu8/cap-editor/actions/workflows/test-e2e.yml/badge.svg)](https://github.com/shu8/cap-editor/actions/workflows/test-e2e.yml)

[![Build](https://github.com/shu8/cap-editor/actions/workflows/build.yml/badge.svg)](https://github.com/shu8/cap-editor/actions/workflows/build.yml)

<img src="./docs/images/cap-logo.gif" align="right"
     alt="Common Alerting Protocol logo" width="150" height="60">

The CAP Editor is a web-based platform for creating, reviewing, managing, and publishing [CAP v1.2](http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html)-formatted emergency and hazard alerts.

It has been created in collaboration with the [International Federation of Red Cross and Red Crescent Societies (IFRC)](https://www.ifrc.org/) as part of the [University College London (UCL)](https://www.ucl.ac.uk/) [Industry Exchange Network (IXN)](https://www.ucl.ac.uk/computer-science/collaborate/ucl-industry-exchange-network-ucl-ixn) by [Shubham Jain](https://sjain.dev).

## Features

- **Secure user authentication** with 'magic links' and usernameless [WebAuthn](https://www.w3.org/TR/webauthn-2/)
- **Internationalised interface** (English and French currently) using [LinguiJS](https://lingui.js.org/index.html).
- **[WMO Register of Alerting Authorities integration](https://alertingauthority.wmo.int/)**: users must be verified by their Alerting Authority to use the platform
- Create **template and draft alerts**
- Create **multilingual alerts**
- **User roles**: composer (view/create/edit draft alerts), approver (viewc/create/edit/publish draft alerts), administrator (create/publish any alert)
- **User-friendly alert creation UI**: individual steps, prefilled defaults, graphical map with circle/polygon drawing
- **[WhatNow](https://whatnow.preparecenter.org/) integration** for pre-filled multilingual alert instruction and descriptions
- **Digital Signatures** with [XMLDSIG](https://www.w3.org/TR/xmldsig-core1/)
- **Decentralised and easily deployable** with [Docker Compose](https://docs.docker.com/compose/)

Please see the [documentation site](https://shu8.github.io/cap-editor/) for full documentation on the system architecture, implementation details, development instructions, testing, and deployment information.

## Screenshots

Dashboard:

<p align="center">
  <img src="./docs/images/dashboard.png" alt="Dashboard" width="80%">
</p>

Editor:

<p align="center">
  <img src="./docs/images/editor.png" alt="CAP Editor" width="80%" align="center">
</p>

## Usage

This platform is for use by Alerting Authorities. It can be installed by individual regions/Alerting Authorities for a fully functional CAP Editor that works out-of-the-box, with built-in access rights management and security.

## Architecture

This is a [Next.js](https://nextjs.org/) project.

In the below architecture diagram, the _feed server_ is this Next.js app.

<p align="center">
  <img src="./docs/images/architecture.png" alt="System Architecture" width="80%" align="center">
</p>
