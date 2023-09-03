import { t } from "@lingui/macro";
import { Alert } from "@prisma/client";
import { DropdownField, FieldProps } from "./common";
import { useToasterI18n } from "../../../lib/useToasterI18n";
import { useState } from "react";
import { HandledError } from "../../../lib/helpers.client";
import ErrorMessage from "../../ErrorMessage";
import { useLingui } from "@lingui/react";

export default function References({
  onUpdate,
  alertData,
  alertingAuthorityId,
}: FieldProps & { alertingAuthorityId: string }) {
  useLingui();

  const toaster = useToasterI18n();
  const [referenceOptions, setReferenceOptions] = useState<Alert[]>([]);
  const fetchReferenceOptions = () => {
    fetch(`/api/alerts/alertingAuthorities/${alertingAuthorityId}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.error) throw new HandledError(res.message);

        // Ensure we don't show option to reference current alert (e.g., when editing a draft)
        setReferenceOptions(
          res.alerts.filter((a: Alert) => a.id !== alertData.identifier)
        );
      })
      .catch((err) =>
        toaster.push(
          <ErrorMessage
            error={err}
            action={t`fetching the list of reference alerts`}
          />
        )
      );
  };

  return (
    <DropdownField
      multi
      onOpen={fetchReferenceOptions}
      onUpdate={onUpdate}
      alertData={alertData}
      label={t`References`}
      options={referenceOptions.map((alert) => ({
        label: `${alert.data.info[0].headline} - sent ${alert.data.sent} (${alert.id})`,
        value: `${alert.data.sender},${alert.id},${alert.data.sent}`,
      }))}
      fieldName="references"
    />
  );
}
