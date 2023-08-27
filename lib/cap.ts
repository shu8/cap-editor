import { validate as validateJSON } from "jsonschema";
import { FormAlertData } from "../components/editor/EditorSinglePage";
import { formatDate } from "./helpers.client";
import { CAPV12JSONSchema, CAPV12Schema } from "./types/cap.schema";
import { MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME } from "./constants";

export const mapFormAlertDataToCapSchema = (
  alertingAuthority: { name: string; author: string },
  alertData: FormAlertData,
  sent: Date,
  id: string,
  multiLanguageGroupId?: string
): CAPV12JSONSchema => {
  // Type as `any` for now because this object needs to next be validated against the JSON schema
  const alert: any = {
    identifier: id,
    sender: alertingAuthority.author,
    sent: formatDate(sent, alertData.timezone),
    status: alertData.status,
    msgType: alertData.msgType,
    // source
    scope: "Public",
    // restriction
    // addresses
    // code
    // note
    ...(alertData.references?.length && {
      references: alertData.references.join(" "),
    }),
    // incidents,
    info: [
      {
        language: alertData.language,
        category: alertData.category,
        event: alertData.event,
        responseType: alertData.responseType,
        urgency: alertData.urgency,
        severity: alertData.severity,
        certainty: alertData.certainty,
        // audience
        // eventCode
        // effective
        onset: alertData.onset,
        expires: alertData.expires,
        senderName: alertingAuthority.name,
        headline: alertData.headline,
        description: alertData.description,
        instruction: alertData.instruction,
        parameter: [
          {
            valueName: "CANONICAL_URL",
            value: `${process.env.BASE_URL}/feed/${id}`,
          },
          ...(multiLanguageGroupId
            ? [
                {
                  valueName: MULTI_LANGUAGE_GROUP_ID_CAP_PARAMETER_NAME,
                  value: multiLanguageGroupId,
                },
              ]
            : []),
        ],
        ...(!!alertData.web?.length && { web: alertData.web }),
        ...(!!alertData.contact?.length && { contact: alertData.contact }),
        // parameter
        resource: alertData.resources,
        area: Object.entries(alertData.regions).map(([regionName, data]) => ({
          areaDesc: regionName,
          ...(data.polygons?.length && { polygon: data.polygons }),
          ...(data.circles?.length && { circle: data.circles }),
          ...(Object.keys(data.geocodes ?? {}).length && {
            geocode: Object.keys(data.geocodes).map((valueName) => ({
              valueName,
              value: data.geocodes[valueName],
            })),
          }),
          // altitude
          // ceiling
        })),
      },
    ],
  };

  const validationResult = validateJSON(alert, CAPV12Schema);
  if (!validationResult.valid) throw validationResult;

  return alert as CAPV12JSONSchema;
};
