import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Severity } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, severity: "" } };

describe("<Severity>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Severity {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Severity");
    await screen.findByText("Select");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Severity {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    await screen.findByText("Extreme");
    await screen.findByText("Severe");
    await screen.findByText("Moderate");
    await screen.findByText("Minor");
    await screen.findByText("Unknown");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Severity {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    const option = await screen.findByText("Extreme");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ severity: "Extreme" });
  });
});
