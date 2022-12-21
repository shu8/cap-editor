import styles from "../../../styles/components/cap/Step.module.css";
import { Button, Form, Input, TagPicker } from "rsuite";
import { useState } from "react";
import { classes } from "../../../lib/helpers";

const Textarea = () => <Input rows={5} as="textarea" />;

export default function TextStep({ onNext }) {
  const [data, setData] = useState({});
  const [numberOfUrls, setNumberOfUrls] = useState(1);

  return (
    <div>
      <h4>Describe the alert</h4>

      <Form>
        <Form.Group>
          <Form.ControlLabel>Headline</Form.ControlLabel>
          <Form.Control name="headline" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Description</Form.ControlLabel>
          <Form.Control accepter={Textarea} name="description" />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Instruction</Form.ControlLabel>
          <Form.Control accepter={Textarea} name="instruction" />
        </Form.Group>
      </Form>

      <h4>Recommended Actions</h4>
      <p>
        Choose the recommended actions for the audience of the alert, using the
        dropdown menu.
      </p>
      <TagPicker
        cleanable
        block
        data={[{ label: "Prepare", value: "Prepare" }]}
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
