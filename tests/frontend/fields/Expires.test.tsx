import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Expires } from "../../../components/editor/fields";
import { messages } from "../../../locales/en/messages";
import { Form } from "rsuite";
import userEvent from "@testing-library/user-event";
import { DateTime } from "luxon";
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

const props = { alertData: { ...defaultFormData, expires: new Date() } };

describe("<Expires>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Expires {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Expires");
    // Expect "YYYY-MM-DD HH:MM:SS" format
    await screen.findByText(
      props.alertData.expires.toISOString().split(".")[0].split("T").join(" ")
    );
  });

  test("shows quick options on click", async () => {
    const onUpdate = jest.fn();
    const { container } = render(<Expires {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = container.querySelector("input");
    const user = userEvent.setup();
    await user.click(input!);

    await screen.findByText("now");
    await screen.findByText("today, end");
    await screen.findByText("tomorrow, start");
    await screen.findByText("tomorrow, end");
    await screen.findByText("in one hour");
  });

  test("triggers callback on selecting date correctly", async () => {
    const onUpdate = jest.fn();
    const { container } = render(<Expires {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = container.querySelector("input");
    const user = userEvent.setup();
    await user.click(input!);

    const button = await screen.findByText("today, end");
    await user.click(button);

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      expires: DateTime.now().endOf("day").toJSDate(),
    });
  });
});
