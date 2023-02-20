import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Editor from "../../components/editor/Editor";
import { describe, expect, test } from "@jest/globals";
import { I18nProvider } from "@lingui/react";
import { i18n } from "@lingui/core";
import { messages } from "../../locales/en/messages";
import { Role } from "@prisma/client";

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
    status: "Actual",
    msgType: "Alert",
    scope: "Public",
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

describe("<Editor> step 2 category", () => {
  test("loads editor and progresses to second step", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await screen.findByText("New alert: category");
    await screen.findByText("Geophysical (e.g., landslide)");
  });

  test("next button disabled before filling out form", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("next button enabled after choosing category", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Geophysical (e.g., landslide)"));
    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(false);
  });

  test("mutliple categories can be chosen", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Geophysical (e.g., landslide)"));
    await user.click(screen.getByText("Medical & public health"));
    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(false);
  });
});
