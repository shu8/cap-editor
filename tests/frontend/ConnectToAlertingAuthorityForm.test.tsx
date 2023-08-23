import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ConnectToAlertingAuthorityForm from "../../components/ConnectToAlertingAuthorityForm";
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

describe("<ConnectToAlertingAuthorityForm>", () => {
  test("renders dropdown correctly", async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: [
              {
                name: "Test AA",
                id: "aa",
                author: "aa@example.com",
                countryCode: "GB",
                polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
              },
            ],
          }),
      })
    ) as any;

    const user = userEvent.setup();
    render(<ConnectToAlertingAuthorityForm />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("connect to Alerting Authorities", {
      exact: false,
    });
    await act(async () => {
      await user.click(
        screen.getByText(
          "Select, or type in the name of, your Alerting Authority"
        )
      );
    });
    await screen.findByText("Test AA");
    expect(global.fetch).toBeCalledTimes(1);
  });

  test("sends correct POST request on submission", async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            result: [
              {
                name: "Test AA",
                id: "aa",
                author: "aa@example.com",
                countryCode: "GB",
                polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
              },
            ],
          }),
      })
    ) as any;

    const user = userEvent.setup();
    render(<ConnectToAlertingAuthorityForm />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("connect to Alerting Authorities", {
      exact: false,
    });
    await act(async () => {
      await user.click(
        screen.getByText(
          "Select, or type in the name of, your Alerting Authority"
        )
      );
    });

    const aa = await screen.findByText("Test AA");
    await user.click(aa);

    await user.click(screen.getByText("Connect to Alerting Authority"));
    expect(global.fetch).toBeCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      "/api/user/alertingAuthorities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertingAuthorityId: "aa" }),
      }
    );
  });

  test("handles GET fetch error", async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.reject(),
      })
    ) as any;

    const user = userEvent.setup();
    render(<ConnectToAlertingAuthorityForm />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("connect to Alerting Authorities", {
      exact: false,
    });
    await act(async () => {
      await user.click(
        screen.getByText(
          "Select, or type in the name of, your Alerting Authority"
        )
      );
    });
    await screen.findByText(
      "There was an error fetching alerting authorities",
      { exact: false }
    );
    expect(global.fetch).toBeCalledTimes(1);
  });

  test("handles POST fetch error", async () => {
    window.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () =>
            Promise.resolve({
              result: [
                {
                  name: "Test AA",
                  id: "aa",
                  author: "aa@example.com",
                  countryCode: "GB",
                  polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
                },
              ],
            }),
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          json: () => Promise.reject(),
        })
      ) as any;

    const user = userEvent.setup();
    render(<ConnectToAlertingAuthorityForm />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("connect to Alerting Authorities", {
      exact: false,
    });
    await act(async () => {
      await user.click(
        screen.getByText(
          "Select, or type in the name of, your Alerting Authority"
        )
      );
    });

    const aa = await screen.findByText("Test AA");
    await user.click(aa);

    await user.click(screen.getByText("Connect to Alerting Authority"));
    expect(global.fetch).toBeCalledTimes(2);
    expect(global.fetch).toHaveBeenLastCalledWith(
      "/api/user/alertingAuthorities",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertingAuthorityId: "aa" }),
      }
    );
    await screen.findByText("There was an error registering", { exact: false });
  });
});
