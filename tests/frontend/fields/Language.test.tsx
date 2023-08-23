import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Language } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, language: "eng" } };

describe("<Language>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Language {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Language");
    await screen.findByText("English (eng)");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Language {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("English (eng)");
    const user = userEvent.setup();
    await user.click(select);
    await screen.findByText("Afar (aar)");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Language {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("English (eng)");
    const user = userEvent.setup();
    await user.click(select);
    const option = await screen.findByText("Afar (aar)");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ language: "aar" });
  });
});
