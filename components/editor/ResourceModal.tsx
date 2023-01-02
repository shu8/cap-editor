import { useState } from "react";
import { Button, Form, Message, Modal, Schema, useToaster } from "rsuite";
import { HandledError } from "../../lib/helpers";
import { Resource } from "../../lib/types/types";

const getMimeType = async (url: string): Promise<string> => {
  try {
    const res = await fetch("/api/mime?" + new URLSearchParams({ url })).then(
      (res) => res.json()
    );
    if (res.error) throw new HandledError(res.message);
    return res.mime;
  } catch {
    throw new HandledError(
      "There was an error accessing this resource. It may be currently unavailable."
    );
  }
};

export default function ResourceModal({
  onSubmit,
}: {
  onSubmit: (resource: Resource | null) => void;
}) {
  const toaster = useToaster();
  const [data, setData] = useState<Resource>({
    resourceDesc: "",
    uri: "",
    mimeType: "",
  });

  return (
    <Modal backdrop open onClose={() => onSubmit(null)}>
      <Modal.Header>
        <Modal.Title>Add resource</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form
          layout="horizontal"
          formValue={data}
          onChange={setData}
          model={Schema.Model({
            description: Schema.Types.StringType().isRequired(
              "Please provide a description of the resource"
            ),
            url: Schema.Types.StringType().isURL(
              "Please provide a valid URL of the resource"
            ),
          })}
          onSubmit={async () => {
            if (!data.resourceDesc || !data.uri) {
              toaster.push(
                <Message type="error" closable duration={0}>
                  Please provide a valid description and URL
                </Message>
              );
              return;
            }

            try {
              const mimeType = await getMimeType(data.uri);
              data.mimeType = mimeType;
              onSubmit(data);
            } catch (err) {
              toaster.push(
                <Message type="error" closable duration={0}>
                  {(err as HandledError).message}
                </Message>
              );
            }
          }}
        >
          <Form.Group>
            <Form.ControlLabel>Description</Form.ControlLabel>
            <Form.Control
              required
              name="resourceDesc"
              placeholder="e.g., image of flood"
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>URL</Form.ControlLabel>
            <Form.Control
              required
              name="uri"
              type="url"
              placeholder="e.g., https://example.com/image.png"
            />
          </Form.Group>

          <Modal.Footer>
            <Button
              onClick={() => onSubmit(null)}
              appearance="ghost"
              color="red"
            >
              Cancel
            </Button>
            <Button appearance="primary" color="blue" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
