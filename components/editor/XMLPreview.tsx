import { Trans, t } from "@lingui/macro";
import { useEffect, useState } from "react";
import XMLViewer from "react-xml-viewer";
import { Panel } from "rsuite";
import { useDebounce } from "usehooks-ts";
import { UserAlertingAuthority } from "../../lib/types/types";
import { FormAlertData } from "./EditorSinglePage";
import { formatDate } from "../../lib/helpers.client";
import { useLingui } from "@lingui/react";

export default function XMLPreview({
  alertingAuthority,
  alertData,
  multiLanguageGroupId,
}: {
  alertingAuthority: UserAlertingAuthority;
  alertData: FormAlertData;
  multiLanguageGroupId?: string;
}) {
  useLingui();

  // Debounce alertData, so we only send preview API request every second
  const debouncedAlertData = useDebounce(alertData, 1000);
  const [xmlPreview, setXmlPreview] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetch(`/api/alerts/alertingAuthorities/${alertingAuthority.id}/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        { data: debouncedAlertData, multiLanguageGroupId },
        function (k, v) {
          return this[k] instanceof Date
            ? formatDate(this[k], debouncedAlertData.timezone)
            : v;
        }
      ),
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
