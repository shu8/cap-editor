import { useToaster } from "rsuite";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";

export const useToasterI18n = () => {
  const originalUseToaster = useToaster();
  return {
    ...originalUseToaster,
    push: (node: React.ReactNode) =>
      originalUseToaster.push(<I18nProvider i18n={i18n}>{node}</I18nProvider>),
  };
};
