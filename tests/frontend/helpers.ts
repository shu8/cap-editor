import { DateTime } from "luxon";

export const defaultFormData = {
  category: [],
  regions: {},
  onset: DateTime.now().startOf("day").toJSDate(),
  expires: new Date(),
  language: "eng",
  contact: "contact@example.com",
  web: "https://example.com",
  responseType: [],
  certainty: "",
  severity: "",
  urgency: "",
  status: "",
  msgType: "",
  references: [],
  event: "",
  headline: "",
  description: "",
  instruction: "",
  resources: [],
};
