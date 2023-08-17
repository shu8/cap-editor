import { Trans } from "@lingui/macro";
import { DateTime } from "luxon";
import { useState } from "react";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  DateRangePicker,
  Form,
  Modal,
} from "rsuite";
import FileDownloadIcon from "@rsuite/icons/FileDownload";

import { useAlertingAuthorityLocalStorage } from "../lib/useLocalStorageState";
import { useToasterI18n } from "../lib/useToasterI18n";
import ErrorMessage from "./ErrorMessage";
import styles from "../styles/Home.module.css";

type Props = {
  languages: string[];
};

export default function ExportAlerts(props: Props) {
  const [alertingAuthorityId] = useAlertingAuthorityLocalStorage();
  const toaster = useToasterI18n();
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormData, setExportFormData] = useState({
    status: ["PUBLISHED", "DRAFT"],
    sent: [DateTime.now().minus({ days: 7 }).toJSDate(), new Date()],
    language: ["eng"],
  });

  const handleExport = () => {
    fetch(`/api/alerts/alertingAuthorities/${alertingAuthorityId}/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exportFormData),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error();

        const blob = new Blob([await res.text()]);
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `cap-alerts-${new Date().toISOString()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      })
      .catch((err) =>
        toaster.push(<ErrorMessage error={err} action="exporting the alerts" />)
      );
  };

  return (
    <>
      <Button
        appearance="ghost"
        startIcon={<FileDownloadIcon />}
        onClick={() => setShowExportModal(true)}
        color="violet"
        className={styles.exportBtn}
      >
        Export alerts
      </Button>

      <Modal open={showExportModal} onClose={() => setShowExportModal(false)}>
        <Modal.Header>
          <Trans>Export Alerts</Trans>
        </Modal.Header>

        <Modal.Body>
          <p>
            <Trans>
              You can export alerts as a JSON file using the form below. Please
              choose from the filters below:
            </Trans>
          </p>
          <br />
          <Form fluid formValue={exportFormData} onChange={setExportFormData}>
            <Form.Group>
              <Form.ControlLabel>
                <Trans>Status</Trans>
              </Form.ControlLabel>
              <Form.Control name="status" accepter={CheckboxGroup} inline>
                <Checkbox value="PUBLISHED">Published</Checkbox>
                <Checkbox value="DRAFT">Draft</Checkbox>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>
                <Trans>Sent between</Trans>
              </Form.ControlLabel>
              <Form.Control
                name="sent"
                format="yyyy-MM-dd HH:mm:ss"
                accepter={DateRangePicker}
              />
            </Form.Group>

            <Form.Group>
              <Form.ControlLabel>
                <Trans>Languages</Trans>
              </Form.ControlLabel>
              <Form.Control name="language" accepter={CheckboxGroup}>
                {props.languages.map((l) => (
                  <Checkbox value={l} key={l}>
                    {l}
                  </Checkbox>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            appearance="ghost"
            color="red"
            onClick={() => setShowExportModal(false)}
          >
            <Trans>Cancel</Trans>
          </Button>

          <Button appearance="primary" color="violet" onClick={handleExport}>
            <Trans>Start Export</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
