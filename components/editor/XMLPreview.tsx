import { AlertingAuthority } from "@prisma/client";
import { FormAlertData } from "./EditorSinglePage";
import { useEffect, useState } from "react";
import XMLViewer from "react-xml-viewer";
import { Panel } from "rsuite";
import { Trans, t } from "@lingui/macro";
import { useDebounce } from "usehooks-ts";

export default function XMLPreview({
  alertingAuthority,
  alertData,
}: {
  alertingAuthority: AlertingAuthority;
  alertData: FormAlertData;
}) {
  // Debounce alertData, so we only send preview API request every second
  const debouncedAlertData = useDebounce(alertData, 1000);
  const [xmlPreview, setXmlPreview] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`/api/alerts/alertingAuthorities/${alertingAuthority.id}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(debouncedAlertData),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) setErrors(res.messages);
        setXmlPreview(res.xml);
      });
  }, [debouncedAlertData, alertingAuthority]);

  return (
    <Panel collapsible header={t`Alert XML Preview`} defaultExpanded bordered>
      <XMLViewer
        xml={xmlPreview}
        invalidXml={
          <div style={{ whiteSpace: "pre-line" }}>
            <p>
              <Trans>Please resolve the following issues:</Trans>
            </p>
            {errors?.length ? (
              <ul>
                {errors?.map((e, i) => (
                  <li key={`error-${i}`}>{e}</li>
                ))}
              </ul>
            ) : (
              t`Please complete the alert details before viewing the preview`
            )}
          </div>
        }
      />
    </Panel>
  );
}
