# Common Alerting Protocol (CAP)

The CAP v1.2 standard can be found [here](http://docs.oasis-open.org/emergency/cap/v1.2/CAP-v1.2-os.html).

## JSON Schema

A custom JSON Schema has been created for CAPv1.2 which can be found at [`cap.schema.json`](../cap.schema.json). This is used for alert validation in the system.

The JSON schema is also converted to a TypeScript type in [`lib/types/cap.schema.ts`](../lib/types/cap.schema.ts), to ease development and provide typing support.

To create the TypeScript type from the JSON schema, run `pnpm generate-cap-schema`.

## Form Data

The CAP Editor form data is defined as the TypeScript type `FormAlertData` in [`components/editor/Editor.tsx`](../components/editor/Editor.tsx). This is the structure used throughout the frontend in React.

This form data is converted to the CAP Schema in the relevant API endpoints using the `mapFormAlertDataToCapSchema` helper function defined in [`lib/cap.ts`](../lib/cap.ts), which also performs the JSON Schema validation check.
