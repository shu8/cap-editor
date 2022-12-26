import styles from "../../../styles/components/cap/Step.module.css";
import { Button, Form, Input, Tag, TagPicker } from "rsuite";
import { forwardRef, useState } from "react";
import { classes } from "../../../lib/helpers";
import { AlertData, StepProps } from "../NewAlert";

const Textarea = forwardRef((props, ref) => (
  <Input {...props} ref={ref} rows={5} as="textarea" />
));
Textarea.displayName = "Textarea";

// CAP info.responseType
const ACTIONS = [
  "Shelter",
  "Evacuate",
  "Prepare",
  "Execute",
  "Avoid",
  "Monitor",
  "Assess",
  "All Clear",
  "None",
];

export default function TextStep({
  onUpdate,
  headline,
  description,
  instruction,
  actions,
}: Partial<AlertData> & StepProps) {
  const [numberOfUrls, setNumberOfUrls] = useState(1);

  return (
    <div>
      <Form fluid>
        <Form.Group>
          <Form.ControlLabel>Headline</Form.ControlLabel>
          <Form.Control
            name="headline"
            onChange={(headline) => onUpdate({ headline })}
            value={headline}
          />
          <Form.HelpText
            style={{ color: (headline?.length ?? 0) > 160 ? "red" : "unset" }}
          >
            {headline?.length ?? 0}/160 characters
          </Form.HelpText>
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control
            accepter={Textarea}
            name="description"
            onChange={(description) => onUpdate({ description })}
            value={description}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Instruction</Form.ControlLabel>
          <Form.Control
            accepter={Textarea}
            name="instruction"
            onChange={(instruction) => onUpdate({ instruction })}
            value={instruction}
          />
        </Form.Group>
      </Form>

      <h4>Recommended Actions</h4>
      <p>
        Choose the recommended actions for the audience of the alert, using the
        dropdown menu.
      </p>
      <TagPicker
        cleanable={false}
        color="green"
        appearance="default"
        block
        data={ACTIONS.map((a) => ({ label: a, value: a.replace(" ", "") }))}
        value={actions}
        onChange={(actions) => onUpdate({ actions })}
      />

      <h4>Link to external resources</h4>
      <p>
        If necessary, add links to resources that offer complementary,
        non-essential information to the alert.
      </p>
      {[...new Array(numberOfUrls)].map((_, n) => (
        <div key={`url-${n + 1}`} className={classes(styles.urlInputWrapper)}>
          <span>URL {n + 1}:</span>
          <Input type="url" />
        </div>
      ))}
      <Button>Add another URL?</Button>
    </div>
  );
}
