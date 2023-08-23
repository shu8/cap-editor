import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { References } from "../../../components/editor/fields";
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

const props = {
  alertData: { ...defaultFormData, references: [] },
  alertingAuthorityId: "test",
};

describe("<References>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<References {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("References");
    await screen.findByText("Select");
  });

  test("renders options on click and handles error", async () => {
    const onUpdate = jest.fn();
    render(<References {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    window.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ error: true }) })
    ) as any;

    const select = await screen.findByText("Select");
    const user = userEvent.setup();
    await user.click(select);
    await screen.findByText(
      "There was an error fetching the list of reference alerts",
      { exact: false }
    );
  });

  test("renders options on click and calls callback correctly", async () => {
    const onUpdate = jest.fn();
    render(<References {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const sent = new Date();
    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: false,
            alerts: [
              {
                id: "test",
                data: {
                  sender: "Sender",
                  sent: sent.toISOString(),
                  info: [{ headline: "Headline" }],
                },
              },
            ],
          }),
      })
    ) as any;

    const select = await screen.findByText("Select");
    const user = userEvent.setup();
    await user.click(select);
    const option = await screen.findByText(
      `Headline - sent ${sent.toISOString()} (test)`
    );
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      references: [`Sender,test,${sent.toISOString()}`],
    });
  });
});
