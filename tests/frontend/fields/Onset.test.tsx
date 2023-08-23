import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { DateTime } from "luxon";
import { Onset } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = { alertData: { ...defaultFormData, onset: new Date() } };

describe("<Onset>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Onset {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Onset");
    // Expect "YYYY-MM-DD HH:MM:SS" format
    await screen.findByText(
      props.alertData.onset.toISOString().split(".")[0].split("T").join(" ")
    );
  });

  test("shows quick options on click", async () => {
    const onUpdate = jest.fn();
    const { container } = render(<Onset {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = container.querySelector("input");
    const user = userEvent.setup();
    await user.click(input!);

    await screen.findByText("now");
    await screen.findByText("today, end");
    await screen.findByText("tomorrow, start");
    await screen.findByText("tomorrow, end");
    await screen.findByText("in one hour");
  });

  test("triggers callback on selecting date correctly", async () => {
    const onUpdate = jest.fn();
    const { container } = render(<Onset {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const input = container.querySelector("input");
    const user = userEvent.setup();
    await user.click(input!);

    const button = await screen.findByText("today, end");
    await user.click(button);

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      onset: DateTime.now().endOf("day").toJSDate(),
    });
  });
});
