import { CheckPicker, Form } from "rsuite";
import { FieldProps } from "./common";
import { Trans } from "@lingui/macro";

export default function ResponseType({ onUpdate, alertData }: FieldProps) {
  return (
    <Form.Group>
      <Form.ControlLabel>
        <Trans>Response</Trans>
      </Form.ControlLabel>
      <Form.Control
        name="category"
        accepter={CheckPicker}
        cleanable={false}
        searchable={false}
        data={[
          "Shelter",
          "Evacuate",
          "Prepare",
          "Execute",
          "Avoid",
          "Monitor",
          "Assess",
          "All Clear",
          "None",
        ].map((a) => ({ label: a, value: a.replace(" ", "") }))}
        onChange={(v) => onUpdate({ responseType: v })}
        value={alertData.responseType}
      />
    </Form.Group>
  );
}
