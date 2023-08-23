import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { Timezone } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, timezone: "Etc/GMT" } };

describe("<Timezone>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Timezone {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Timezone");
    await screen.findByText("(UTC) Coordinated Universal Time");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Timezone {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("(UTC) Coordinated Universal Time");

    const user = userEvent.setup();
    await user.click(select);
    await screen.findByText("(UTC) Edinburgh, London");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Timezone {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("(UTC) Coordinated Universal Time");

    const user = userEvent.setup();
    await user.click(select);
    const option = await screen.findByText("(UTC) Edinburgh, London");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ timezone: "Europe/London" });
  });
});
