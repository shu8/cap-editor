import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Web } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, web: "" } };

describe("<Web>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Web {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Web");
    await screen.findByRole("textbox");
  });

  test("triggers callback on typing correctly", async () => {
    const onUpdate = jest.fn();
    render(<Web {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByRole("textbox");
    const user = userEvent.setup();
    await user.type(input, "t");

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ web: "t" });
  });
});
