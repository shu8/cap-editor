import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import UpdatePersonalDetailsForm from "../../components/UpdatePersonalDetailsForm";
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

jest.mock("next/router", () => ({
  useRouter: jest.fn(() => ({
    reload: jest.fn(),
  })),
}));

describe("<UpdatePersonalDetailsForm>", () => {
  test("renders form correctly", async () => {
    render(<UpdatePersonalDetailsForm />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Name");
    await screen.findByText("Save");
  });

  test("sends correct POST request on submission", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );

    const user = userEvent.setup();
    render(<UpdatePersonalDetailsForm />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByPlaceholderText("Your name");
    await user.click(input);
    await act(async () => {
      await user.type(input, "Foo");
    });

    await user.click(screen.getByText("Save"));
    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toHaveBeenLastCalledWith("/api/user/personalDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Foo" }),
    });

    await screen.findByText("Your personal details were updated successfully", {
      exact: false,
    });
  });

  test("handles POST error on submission", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject({}),
      })
    );

    const user = userEvent.setup();
    render(<UpdatePersonalDetailsForm />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByPlaceholderText("Your name");
    await user.click(input);
    await act(async () => {
      await user.type(input, "Foo");
    });

    await user.click(screen.getByText("Save"));
    expect(global.fetch).toBeCalledTimes(1);
    expect(global.fetch).toHaveBeenLastCalledWith("/api/user/personalDetails", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Foo" }),
    });

    await screen.findByText(
      "There was an error updating your personal details",
      { exact: false }
    );
  });
});
