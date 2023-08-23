import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Description } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, description: "" } };

describe("<Description>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Description {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Description");
    await screen.findByRole("textbox");
  });

  test("triggers callback on typing correctly", async () => {
    const onUpdate = jest.fn();
    render(<Description {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByRole("textbox");
    const user = userEvent.setup();
    const text = "test";
    await user.type(input, text);

    expect(onUpdate).toBeCalledTimes(text.length);
    expect(onUpdate).toBeCalledWith({ description: text });
  });
});
