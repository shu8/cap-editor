import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Timezone } from "../../../components/editor/fields";
import { messages } from "../../../locales/en/messages";
import { Form } from "rsuite";
import userEvent from "@testing-library/user-event";
import { defaultFormData } from "../helpers";

i18n.load({ en: messages });
i18n.activate("en");
const TestingProvider = ({ children }: any) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
      <Form>{children}</Form>
    </I18nProvider>
  );
};

const props = { alertData: { ...defaultFormData, timezone: "Etc/GMT" } };

describe("<Timezone>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Timezone {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Timezone");
    await screen.findByText("(UTC) Coordinated Universal Time");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Timezone {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("(UTC) Coordinated Universal Time");

    const user = userEvent.setup();
    await user.click(select);
    await screen.findByText("(UTC) Edinburgh, London");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Timezone {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("(UTC) Coordinated Universal Time");

    const user = userEvent.setup();
    await user.click(select);
    const option = await screen.findByText("(UTC) Edinburgh, London");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ timezone: "Europe/London" });
  });
});
