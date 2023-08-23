import { DateTime } from "luxon";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";

import { messages } from "../../locales/en/messages";
import { Form } from "rsuite";

i18n.load({ en: messages });
i18n.activate("en");
export const TestingProvider = ({ children }: any) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
      <Form>{children}</Form>
    </I18nProvider>
  );
};

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
