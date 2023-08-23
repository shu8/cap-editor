import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { ResponseType } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, responseType: [] } };

describe("<ResponseType>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<ResponseType {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Response");
    await screen.findByText("Select");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<ResponseType {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    await screen.findByText("Shelter");
    await screen.findByText("Evacuate");
    await screen.findByText("Prepare");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<ResponseType {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    const option = await screen.findByText("Shelter");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ responseType: ["Shelter"] });
  });
});
