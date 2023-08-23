import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Category } from "../../../components/editor/fields";
import userEvent from "@testing-library/user-event";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, category: [] } };

describe("<Category>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Category {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Category");
    await screen.findByText("Select");
  });

  test("renders options on click", async () => {
    const onUpdate = jest.fn();
    render(<Category {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    await screen.findByText("Geophysical (e.g., landslide)");
    await screen.findByText("Meteorological (inc. flood)");
  });

  test("triggers callback on option click correctly", async () => {
    const onUpdate = jest.fn();
    render(<Category {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const select = await screen.findByText("Select");

    const user = userEvent.setup();
    await user.click(select);

    const option = await screen.findByText("Geophysical (e.g., landslide)");
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({ category: ["Geo"] });
  });
});
