import styles from "../../../styles/components/cap/Step.module.css";
import { Form, SelectPicker, TagInput, TagPicker } from "rsuite";
import { AlertData, StepProps } from "../NewAlert";
import { classes } from "../../../lib/helpers";
import { useState } from "react";

const STATUSES = ["Actual", "Exercise", "System", "Test", "Draft"];
const MESSAGE_TYPES = ["Alert", "Update", "Cancel", "Ack", "Error"];
const SCOPES = ["Public", "Restricted", "Private"];

export default function MetadataStep({
  onUpdate,
  status,
  msgType,
  scope,
  restriction,
  addresses,
  references,
}: Partial<AlertData> & StepProps) {
  const [referenceOptions, setReferenceOptions] = useState([]);
  const fetchReferenceOptions = () => {
    fetch("/api/alerts?json=true")
      .then((res) => res.json())
      .then((res) => setReferenceOptions(res.alerts));
  };

  return (
    <div>
      <h4>Create the Alert</h4>

      <Form fluid>
        <Form.Group>
          <Form.ControlLabel>Status</Form.ControlLabel>
          <Form.Control
            block
            name="status"
            cleanable={false}
            searchable={false}
            onChange={(status) => onUpdate({ status })}
            accepter={SelectPicker}
            data={STATUSES.map((s) => ({ label: s, value: s }))}
            value={status}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Message type</Form.ControlLabel>
          <Form.Control
            block
            name="msgType"
            cleanable={false}
            searchable={false}
            onChange={(msgType) => onUpdate({ msgType })}
            accepter={SelectPicker}
            data={MESSAGE_TYPES.map((t) => ({ label: t, value: t }))}
            value={msgType}
          />
        </Form.Group>
        <Form.Group>
          <Form.ControlLabel>Scope</Form.ControlLabel>
          <Form.Control
            block
            name="scope"
            cleanable={false}
            searchable={false}
            onChange={(scope) => {
              const updateData = { scope, addresses, restriction };
              if (scope !== "Private") {
                updateData.addresses = [];
              } else if (scope !== "Restricted") {
                updateData.restriction = "";
              }
              onUpdate(updateData);
            }}
            accepter={SelectPicker}
            data={SCOPES.map((s) => ({ label: s, value: s }))}
            value={scope}
          />
        </Form.Group>

        {scope === "Restricted" && (
          <Form.Group className={classes(styles.indent)}>
            <Form.ControlLabel>Restriction</Form.ControlLabel>
            <Form.Control
              block
              name="restriction"
              onChange={(restriction) => onUpdate({ restriction })}
              value={restriction}
            />
            <Form.HelpText>
              Please describe the rule for limiting the distribution of this{" "}
              <i>Restricted</i> Alert.
            </Form.HelpText>
          </Form.Group>
        )}

        {scope === "Private" && (
          <Form.Group className={classes(styles.indent)}>
            <Form.ControlLabel>Addresses</Form.ControlLabel>
            <Form.Control
              block
              name="addresses"
              cleanable={false}
              onChange={(addresses) => {
                console.log(addresses);
                return onUpdate({ addresses: addresses ?? [] });
              }}
              accepter={TagInput}
              trigger={["Enter", "Space", "Comma"]}
              value={addresses}
              data={[]}
            />
            <Form.HelpText>
              Please provide the IDs/addresses of the intended recipients of
              this <i>Private</i> Alert.
            </Form.HelpText>
          </Form.Group>
        )}

        <Form.Group>
          <Form.ControlLabel>References</Form.ControlLabel>

          <Form.Control
            block
            name="references"
            accepter={TagPicker}
            data={referenceOptions.map((r) => ({ label: r.id, value: r.id }))}
            onChange={(references) => onUpdate({ references })}
            onOpen={fetchReferenceOptions}
            sort={() => (a, b) =>
              new Date(a.data.sent) < new Date(b.data.sent) ? 1 : -1}
            value={references}
            renderMenuItem={(v) => <div>{v}</div>}
          />
          <Form.HelpText>
            Does this Alert reference any previous Alerts?
          </Form.HelpText>
        </Form.Group>
      </Form>
    </div>
  );
}
