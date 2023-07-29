import { beforeAll, describe, expect, jest, test } from "@jest/globals";
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
    category: ["Met"],
    regions: {},
    from: startOfToday.toString(),
    to: new Date().toString(),
    actions: [],
    certainty: "",
    severity: "",
    urgency: "",
    status: "Actual",
    msgType: "Alert",
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
  roles: ["COMPOSER"] as Role[],
  onShareAlert: () => null,
  onSubmit: () => null,
  onCancel: () => null,
};

beforeAll(() => {
  window.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          error: false,
          countries: ["United Kingdom"],
        }),
    })
  ) as any;
});

describe("<Editor> step 3 map", () => {
  test("loads editor and progresses to third step", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await screen.findByText("New alert: map");
    await screen.findByText("Choose the location of the alert", {
      exact: false,
    });
  });

  test("next button disabled before filling out form", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("loads country data", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const selector = await screen.findByText("Select");
    await user.click(selector);

    await screen.findByText("United Kingdom");
  });

  test("does not show draw polygon buttons until reaching Map step", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    expect(screen.queryAllByTitle("Draw Circle")).toHaveLength(0);
    expect(screen.queryAllByTitle("Draw Polygon")).toHaveLength(0);
    await user.click(screen.getByText("Next"));

    expect(screen.queryAllByTitle("Draw Circle")).toHaveLength(0);
    expect(screen.queryAllByTitle("Draw Polygon")).toHaveLength(0);
    await user.click(screen.getByText("Next"));

    expect(screen.queryAllByTitle("Draw Circle").length).toBeGreaterThan(0);
    expect(screen.queryAllByTitle("Draw Polygon").length).toBeGreaterThan(0);
  });

  test("can click on country", async () => {
    const user = userEvent.setup();
    const { container } = render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const selector = await screen.findByText("Select");
    await user.click(selector);
    await user.click(screen.getByText("United Kingdom"));
  });
});
