# Editor (UI)

The core Editor frontend is written as the [`Editor` component](../components/editor/Editor.tsx).

The Editor includes the following steps and mappings to the CAP protocol:

- Metadata

  - Status (`alert.status`)
  - Message Type (`alert.msgType`)
  - Scope (`alert.scope`)
    - _if 'restricted'_: Restriction (`alert.restriction`)
    - _if 'private'_: Addresses (`alert.addresses`)
  - References (`alert.references`)

- Category (`alert.info[].category`)

- Map (`alert.info[].area`)

  - Area description (`alert.info[].area[].areaDesc`)
  - Polygon (`alert.info[].area[].polygon`)
  - Circle (`alert.info[].area[].circle`)

- Data

  - Start time (`alert.info[].effective`)
  - End time (`alert.info[].expires`)
  - Severity (`alert.info[].severity`)
  - Certainty (`alert.info[].certainty`)
  - Urgency (`alert.info[].urgency`)
  - Recommended Actions (`alert.info[].responseType`)

- Text

  - Event (`alert.info[].event`)
  - Headline (`alert.info[].headline`)
  - Description (`alert.info[].description`)
  - Instruction (`alert.info[].instruction`)
  - Resources (`alert.info[].resource`)
    - MIME type -- automatically extracted (`alert.info[].resource[].mimeType`)
    - Description (`alert.info[].resource[].description`)
    - URI (`alert.info[].resource[].uri`)

- Summary
