import { validate as validateJSON } from "jsonschema";
import { FormAlertData } from "../components/editor/Editor";
import { formatDate } from "./helpers.client";
import { CAPV12JSONSchema, CAPV12Schema } from "./types/cap.schema";

export const mapFormAlertDataToCapSchema = (
  alertingAuthority: { name: string; author: string },
  alertData: FormAlertData,
  id: string
): CAPV12JSONSchema => {
  // Type as `any` for now because this object needs to next be validated against the JSON schema
  const alert: any = {
    identifier: id,
    sender: alertingAuthority.author,
    sent: formatDate(new Date(), alertData.timezone),
    status: alertData.status,
    msgType: alertData.msgType,
    // source
    scope: "Public",
    // restriction
    // addresses
    // code
    // note
    ...(alertData.references?.length && {
      references: alertData.references?.join(" "),
    }),
    // incidents,
    info: Object.entries(alertData.textLanguages).map(
      ([language, languageData]) => ({
        language,
        category: alertData.category,
        event: languageData.event,
        responseType: alertData.actions,
        urgency: alertData.urgency,
        severity: alertData.severity,
        certainty: alertData.certainty,
        // audience
        // eventCode
        // effective
        onset: alertData.from,
        expires: alertData.to,
        senderName: alertingAuthority.name,
        headline: languageData.headline,
        description: languageData.description,
        instruction: languageData.instruction,
        web: `${process.env.BASE_URL}/feed/${id}`,
        contact: alertingAuthority.author,
        // parameter
        resource: languageData.resources,
        area: Object.entries(alertData.regions).map(([regionName, data]) => ({
          areaDesc: regionName,
          ...(typeof data?.[0] === "string" && { circle: data }),
          ...(typeof data?.[0] !== "string" && { polygon: data }),
          // geocode
          // altitude
          // ceiling
        })),
      })
    ),
  };

  const validationResult = validateJSON(alert, CAPV12Schema);
  if (!validationResult.valid) {
    console.error(validationResult);
    throw "Invalid alert details";
  }

  return alert as CAPV12JSONSchema;
};
