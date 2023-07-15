import { t, Trans } from "@lingui/macro";
import { Alert } from "@prisma/client";
import { useState } from "react";
import { Form, SelectPicker, TagPicker } from "rsuite";

import { classes, HandledError } from "../../../lib/helpers.client";
import { useToasterI18n } from "../../../lib/useToasterI18n";
import styles from "../../../styles/components/editor/Step.module.css";
import ErrorMessage from "../../ErrorMessage";
import { FormAlertData, StepProps } from "../Editor";

const STATUSES = ["Actual", "Exercise", "System", "Test"];
const MESSAGE_TYPES = ["Alert", "Update", "Cancel"];

export default function MetadataStep({
  onUpdate,
  status,
  msgType,
  references,
}: Partial<FormAlertData> & StepProps) {
  const toaster = useToasterI18n();
  const [referenceOptions, setReferenceOptions] = useState<Alert[]>([]);
  const fetchReferenceOptions = () => {
    fetch("/api/alerts?json=true")
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);
        setReferenceOptions(res.alerts);
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage error={err} action={t`fetching past alerts`} />
        )
      );
  };

  return (
    <div>
      <Form fluid>
        <Form.Group>
          <Form.ControlLabel>
            <Trans>Status</Trans>
          </Form.ControlLabel>
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
          <Form.ControlLabel>
            <Trans>Message type</Trans>
          </Form.ControlLabel>
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

        {["Update", "Cancel"].includes(msgType!) && (
          <Form.Group>
            <Form.ControlLabel>
              <Trans>References</Trans>
              <Form.Control
                block
                name="references"
                accepter={TagPicker}
                data={referenceOptions.map((alert) => ({
                  label: alert.id,
                  value: `${alert.data.sender},${alert.id},${alert.data.sent}`,
                }))}
                onChange={(references) => onUpdate({ references })}
                onOpen={fetchReferenceOptions}
                sort={() => (a, b) => {
                  if (!a?.data?.sent || !b?.data?.sent) return 1;
                  return new Date(a.data.sent) < new Date(b.data.sent) ? 1 : -1;
                }}
                value={references}
                renderMenuItem={(v) => <div>{v}</div>}
              />
            </Form.ControlLabel>

            <Form.HelpText>
              <Trans>Does this Alert reference any previous Alerts?</Trans>
            </Form.HelpText>
          </Form.Group>
        )}
      </Form>
    </div>
  );
}
