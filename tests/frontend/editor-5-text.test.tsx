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

const getEditorProps = () => ({
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
    actions: ["Prepare"],
    certainty: "Likely",
    severity: "Minor",
    urgency: "Future",
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
});

beforeAll(() => {
  window.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ error: false, countries: ["England"] }),
    })
  ) as any;
});

describe("<Editor> step 5 text", () => {
  test("loads editor and progresses to fifth step", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await screen.findByText("New alert: text");
    await screen.findByText("What is the event this alert pertains to?");
    await screen.findByText("Headline");
    await screen.findByText("Description");
    await screen.findByText("Instruction");
    await screen.findByText("Link to external resources");
  });

  test("can fill out details", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < inputs.length; i++) {
      expect(
        ((await screen.findByText("Next")) as HTMLButtonElement).disabled
      ).toBe(true);

      const input = inputs[i];
      await user.type(input, "Test");
    }

    await screen.findByText("4/15 characters");
    await screen.findByText("4/160 characters");
  });

  test("can add resource", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add URL?"));
    await user.type(
      screen.getByPlaceholderText("e.g., image of flood", { exact: false }),
      "Test Resource"
    );
    await user.type(
      screen.getByPlaceholderText("e.g., https://", { exact: false }),
      "https://example.com"
    );
    await user.click(screen.getByText("Save"));

    await screen.findByText("Test Resource (", {
      exact: false,
    });
  });

  test("validates resource inputs", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add URL?"));
    await user.type(
      screen.getByPlaceholderText("e.g., image of flood", { exact: false }),
      "Test Resource"
    );
    await user.click(screen.getByText("Save"));

    expect(
      screen.queryByText("Test Resource (", {
        exact: false,
      })
    ).toBeNull();
  });

  test("can delete resource", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add URL?"));
    await user.type(
      screen.getByPlaceholderText("e.g., image of flood", { exact: false }),
      "Test Resource"
    );
    await user.type(
      screen.getByPlaceholderText("e.g., https://", { exact: false }),
      "https://example.com"
    );
    await user.click(screen.getByText("Save"));

    await screen.findByText("Test Resource (", {
      exact: false,
    });

    await user.click(screen.getByText("Delete?"));

    expect(
      screen.queryByText("Test Resource (", {
        exact: false,
      })
    ).toBeNull();
  });

  test("can add new language", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add another language?"));
    await user.click(screen.getByText("Language"));
    await user.click(screen.getByText("French"));
    await user.click(screen.getByText("Add language"));

    await screen.findByText("French");

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(true);
  });

  test("can cancel adding new language", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add another language?"));
    const cancelButtons = screen.getAllByText("Cancel");
    const modalCancelButton = cancelButtons.find((b) =>
      b.parentElement?.classList.contains("rs-modal-footer")
    );
    expect(modalCancelButton).toBeTruthy();
    await user.click(modalCancelButton!);
    expect(screen.queryByText("Language")).toBeNull();
  });

  test("requires new language to be chosen", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add another language?"));
    await user.click(screen.getByText("Add language"));

    await screen.findByText("Please choose a language to add");
    expect(screen.queryByText("French")).toBeNull();
  });

  test("can delete language", async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => true);
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add another language?"));
    await user.click(screen.getByText("Language"));
    await user.click(screen.getByText("French"));
    await user.click(screen.getByText("Add language"));

    await screen.findByText("French");
    const languageTab = await screen.findByText("French");
    await user.click(languageTab.querySelector("span")!);
    expect(screen.queryByText("French")).toBeNull();
  });

  test("does not delete language if prompt is false", async () => {
    const user = userEvent.setup();
    window.confirm = jest.fn(() => false);
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await user.click(screen.getByText("Add another language?"));
    await user.click(screen.getByText("Language"));
    await user.click(screen.getByText("French"));
    await user.click(screen.getByText("Add language"));

    await screen.findByText("French");
    const languageTab = await screen.findByText("French");
    await user.click(languageTab.querySelector("span")!);
    await screen.findByText("French");
  });

  test("can click next button after form completed", async () => {
    const user = userEvent.setup();
    render(<Editor {...getEditorProps()} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const inputs = screen.getAllByRole("textbox");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      await user.type(input, "Test");
    }

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(false);

    await user.click(screen.getByText("Add URL?"));
    await user.type(
      screen.getByPlaceholderText("e.g., image of flood", { exact: false }),
      "Test Resource"
    );
    await user.type(
      screen.getByPlaceholderText("e.g., https://", { exact: false }),
      "https://example.com"
    );
    await user.click(screen.getByText("Save"));

    expect(
      ((await screen.findByText("Next")) as HTMLButtonElement).disabled
    ).toBe(false);
  });
});
