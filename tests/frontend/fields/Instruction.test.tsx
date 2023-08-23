import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Instruction } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = {
  alertData: { ...defaultFormData, instruction: "" },
  alertingAuthority: { countryCode: "GB" },
};

describe("<Instruction>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Instruction {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Instruction");
    await screen.findByRole("textbox");
    await screen.findByText("Auto-fill from WhatNow?");
  });

  test("triggers callback on typing correctly", async () => {
    const onUpdate = jest.fn();
    render(<Instruction {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByRole("textbox");
    const user = userEvent.setup();
    await user.type(input, "t");

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ instruction: "t" });
  });

  test("opens WhatNow modal on click and handles error", async () => {
    const onUpdate = jest.fn();
    render(<Instruction {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });
    const btn = await screen.findByText("Auto-fill from WhatNow?");

    window.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ error: true }) })
    ) as any;

    const user = userEvent.setup();
    await user.click(btn);

    await screen.findByText("There was an error fetching WhatNow messages", {
      exact: false,
    });
  });

  test("opens WhatNow modal on click and shows messages and calls callback correctly", async () => {
    const onUpdate = jest.fn();
    render(<Instruction {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });
    const btn = await screen.findByText("Auto-fill from WhatNow?");

    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: false,
            data: [
              {
                id: "test",
                eventType: "Test Event",
                translations: {
                  en: { stages: { mitigation: ["Test Instruction"] } },
                },
              },
            ],
          }),
      })
    ) as any;

    const user = userEvent.setup();
    await user.click(btn);

    await screen.findByText(
      "You can auto-fill the alert instruction with pre-written WhatNow messages."
    );
    const eventHeader = await screen.findByText("Test Event");

    await user.click(eventHeader);
    const stageHeader = await screen.findByText("Mitigation", { exact: false });
    await user.click(stageHeader);
    await screen.findByText("- Test Instruction");

    const addBtn = await screen.findByText("Add this text?");
    await user.click(addBtn);

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ instruction: "- Test Instruction" });
  });
});
