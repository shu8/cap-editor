import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { MessageType } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, msgType: "" } };

describe("<MessageType>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<MessageType {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Type");
    await screen.findByText("Select");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<MessageType {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");
    const user = userEvent.setup();
    await user.click(select);
    await screen.findByText("Alert");
    await screen.findByText("Update");
    await screen.findByText("Cancel");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<MessageType {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");
    const user = userEvent.setup();
    await user.click(select);
    const option = await screen.findByText("Alert");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ msgType: "Alert" });
  });
});
