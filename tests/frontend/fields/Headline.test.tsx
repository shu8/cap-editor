import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Headline } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, headline: "" } };

describe("<Headline>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Headline {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Headline");
    await screen.findByText("0/140 characters");
    await screen.findByRole("textbox");
  });

  test("triggers callback on typing correctly", async () => {
    const onUpdate = jest.fn();
    render(<Headline {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = await screen.findByRole("textbox");
    const user = userEvent.setup();
    await user.type(input, "t");

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ headline: "t" });
  });
});
