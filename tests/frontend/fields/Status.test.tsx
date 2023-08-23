import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Status } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, status: "" } };

describe("<Status>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Status {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Status");
    await screen.findByText("Select");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Status {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    await screen.findByText("Actual");
    await screen.findByText("Exercise");
    await screen.findByText("System");
    await screen.findByText("Test");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Status {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    const option = await screen.findByText("Actual");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ status: "Actual" });
  });
});
