import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Certainty } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, certainty: "" } };

describe("<Certainty>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Certainty {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Certainty");
    await screen.findByText("Select");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Certainty {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    await screen.findByText("Observed");
    await screen.findByText("Likely");
    await screen.findByText("Possible");
    await screen.findByText("Unlikely");
    await screen.findByText("Unknown");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Certainty {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    const option = await screen.findByText("Observed");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ certainty: "Observed" });
  });
});
