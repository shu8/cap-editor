import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { Role } from "@prisma/client";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Editor from "../../components/editor/Editor";
import { messages } from "../../locales/en/messages";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);
i18n.load({ en: messages });
i18n.activate("en");
const TestingProvider = ({ children }: any) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
      {children}
    </I18nProvider>
  );
};

const editorProps = {
  alertingAuthority: {
    id: "aa",
    author: "AA@example.com",
    countryCode: "GB",
    name: "AA",
    polygon: null,
  },
  defaultAlertData: {
    category: [],
    regions: {},
    from: startOfToday.toString(),
    to: new Date().toString(),
    actions: [],
    certainty: "",
    severity: "",
    urgency: "",
    status: "",
    msgType: "",
    references: [],
    textLanguages: {
      en: {
        event: "",
        headline: "",
        description: "",
        instruction: "",
        resources: [],
      },
    },
  },
  isShareable: false,
  roles: ["EDITOR"] as Role[],
  onShareAlert: () => null,
  onSubmit: () => null,
  onCancel: () => null,
};

describe("<Editor> step 1 metadata", () => {
  test("loads editor with first step", async () => {
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await screen.findByText("New alert: metadata");
    await screen.findByText("Status");
    await screen.findByText("Message type");
    await screen.findByText("Scope");
    await screen.findByText("References");
  });

  test("can select status", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[0]);
    await user.click(screen.getByText("Actual"));
  });

  test("can select message type", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[1]);
    await user.click(screen.getByText("Alert"));

    // No 'references' should be shown if msgType=Alert
    const referencesField = screen.queryByText("References");
    expect(referencesField).toBeNull();
  });

  test("shows references if msgType=update", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[1]);
    await user.click(screen.getByText("Update"));
    await screen.findByText("References");
  });

  test("shows references if msgType=cancel", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[1]);
    await user.click(screen.getAllByText("Cancel")[1]);
    await screen.findByText("References");
  });

  test("cancel button handled when confirmation true", async () => {
    const handleCancel = jest.fn();
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);

    render(<Editor {...editorProps} onCancel={handleCancel} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Cancel"));
    expect(handleCancel).toBeCalledTimes(1);
  });

  test("cancel button ignored when confirmation false", async () => {
    const handleCancel = jest.fn();
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);

    render(<Editor {...editorProps} onCancel={handleCancel} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Cancel"));
    expect(handleCancel).toBeCalledTimes(0);
  });

  test("next button disabled before filling out form", async () => {
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });
});
