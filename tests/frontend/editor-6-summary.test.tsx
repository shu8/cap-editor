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
    actions: ["Prepare"],
    certainty: "Likely",
    severity: "Minor",
    urgency: "Future",
    status: "Actual",
    msgType: "Alert",
    references: [],
    textLanguages: {
      en: {
        event: "Test Event",
        headline: "Test Headline",
        description: "Test Description",
        instruction: "Test Instruction",
        resources: [
          {
            mimeType: "text/html",
            resourceDesc: "Test Resource",
            uri: "https://example.com",
          },
        ],
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
      json: () => Promise.resolve({ error: false, countries: ["England"] }),
    })
  ) as any;
});

describe("<Editor> step 6 summary", () => {
  test("loads editor and progresses to sixth step", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, { wrapper: TestingProvider });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await screen.findByText("New alert: summary");

    const steps = ["Metadata", "Category", "Map", "Data", "Text"];
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      expect(
        (
          await screen.findAllByText(
            new RegExp(`\b${step}|${step.toLowerCase()}`)
          )
        ).length
      ).toBeGreaterThanOrEqual(2);
    }
  });

  test("metadata summary is populated", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    let el = await screen.findByText("Status:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Status: Actual");

    el = await screen.findByText("Message Type:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Message Type: Alert");

    await screen.findByText("References:", { exact: false });
  });

  test("category summary is populated", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const el = await screen.findByText("Alert Category:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Alert Category: Met");
  });

  test("map summary is populated", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const el = await screen.findByText("Regions:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Regions: England");
  });

  test("data summary is populated", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    let el = await screen.findByText("From:", { exact: false });
    expect(el.parentElement!.textContent).toEqual(
      `From: ${editorProps.defaultAlertData.from.toLocaleString()}`
    );

    el = await screen.findByText("To:", { exact: false });
    expect(el.parentElement!.textContent).toEqual(
      `To: ${editorProps.defaultAlertData.to.toLocaleString()}`
    );

    el = await screen.findByText("Severity:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Severity: Minor");

    el = await screen.findByText("Certainty:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Certainty: Likely");

    el = await screen.findByText("Urgency:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Urgency: Future");

    el = await screen.findByText("Actions:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Actions: Prepare");
  });

  test("text summary is populated", async () => {
    const user = userEvent.setup();
    render(<Editor {...editorProps} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    await screen.findByText("English");

    let el = await screen.findByText("Event:", { exact: false });
    expect(el.parentElement!.textContent).toEqual(`Event: Test Event`);

    el = await screen.findByText("Headline:", { exact: false });
    expect(el.parentElement!.textContent).toEqual(`Headline: Test Headline`);

    el = await screen.findByText("Description:", { exact: false });
    expect(el.parentElement!.textContent).toEqual(
      "Description: Test Description"
    );

    el = await screen.findByText("Instruction:", { exact: false });
    expect(el.parentElement!.textContent).toEqual(
      "Instruction: Test Instruction"
    );

    el = await screen.findByText("Resources:", { exact: false });
    expect(el.parentElement!.textContent).toEqual("Resources: Test Resource");
  });

  test("only has save as draft option", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<Editor {...editorProps} onSubmit={onSubmit} />, {
      wrapper: TestingProvider,
    });

    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));
    await user.click(screen.getByText("Next"));

    const button = (await screen.findByText(
      "Save as draft"
    )) as HTMLButtonElement;
    expect(button).toBeTruthy();
    expect(button.disabled!).toBe(false);

    await user.click(button);
    expect(onSubmit).toBeCalledTimes(1);
  });
});
