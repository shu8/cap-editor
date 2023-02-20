import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Editor from "../../components/editor/Editor";
import { describe, expect, jest, test } from "@jest/globals";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { messages } from "../../locales/en/messages";
import { Role } from "@prisma/client";
import { FALSE } from "ol/functions";

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
    scope: "",
    restriction: "",
    addresses: [],
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
  });

  test("can select scope", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[2]);
    await user.click(screen.getByText("Public"));
  });

  test("shows restriction if scope=restricted", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[2]);
    await user.click(screen.getByText("Restricted"));

    const textInputs = screen.queryAllByRole("textbox");
    const restrictedInput = textInputs.find(
      (i) => (i as HTMLInputElement).name === "restriction"
    );
    expect(restrictedInput).toBeTruthy();

    await screen.findByText("Restriction");
    await user.type(restrictedInput!, "Test");
  });

  test("shows addresses if scope=private", async () => {
    const user = userEvent.setup();

    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    const inputs = await screen.findAllByText("Select");
    await user.click(inputs[2]);
    await user.click(screen.getByText("Private"));
    await screen.findByText("Addresses");
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
