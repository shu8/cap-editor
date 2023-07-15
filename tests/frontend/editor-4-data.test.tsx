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
    regions: {
      England: [
        [49.8858833313549, -6.36867904666016],
        [49.8858833313549, 1.75900208943311],
        [55.8041437929974, 1.75900208943311],
        [55.8041437929974, -6.36867904666016],
        [49.8858833313549, -6.36867904666016],
      ],
    },
    from: startOfToday,
    to: new Date(),
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
  roles: ["EDITOR"] as Role[],
  onShareAlert: () => null,
  onSubmit: () => null,
  onCancel: () => null,
};

beforeAll(() => {
  window.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ error: false, countries: ["England"] }),
    })
  ) as any;
});

describe("<Editor> step 4 data", () => {
  test("loads editor and progresses to fourth step", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await screen.findByText("New alert: data");
    await screen.findByText("Severity, Certainty, & Urgency");
    await screen.findByText("Recommended Actions");
    await screen.findByText("Select the start and end time", {
      exact: false,
    });
  });

  test("next button disabled before filling out form", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("can fill out date", async () => {
    const user = userEvent.setup();
    const { container } = render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const datepicker = container.querySelector("input:first-child");
    expect(datepicker).toBeTruthy();

    user.type(
      datepicker!,
      `${startOfToday.getUTCFullYear() + 1}01010000 to ${
        startOfToday.getUTCFullYear() + 1
      }01020000`
    );

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("can use certainty/severity matrix", async () => {
    const user = userEvent.setup();
    const { container } = render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(container.getElementsByClassName("cell")[0]);
    await screen.findByText("Minor");
    await screen.findByText("Likely");

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("can use urgency slider", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Future"));
    expect((await screen.findAllByText("Future")).length).toBe(2);

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("can choose recommended actions", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Select"));
    await user.click(screen.getByText("Shelter"));

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("can click next button after form completed", async () => {
    const user = userEvent.setup();
    const { container } = render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(container.getElementsByClassName("cell")[0]);
    await screen.findByText("Minor");
    await screen.findByText("Likely");

    await user.click(screen.getByText("Future"));

    await user.click(screen.getByText("Select"));
    await user.click(screen.getByText("Shelter"));

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(false);
  });
});
