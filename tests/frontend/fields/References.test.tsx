import { describe, expect, jest, test } from "@jest/globals";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";
import { References } from "../../../components/editor/fields";
import { TestingProvider, defaultFormData } from "../helpers";

const props = {
  alertData: { ...defaultFormData, references: [] },
  alertingAuthorityId: "test",
};

describe("<References>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<References {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("References");
    await screen.findByText("Select");
  });

  test("renders options on click and handles error", async () => {
    const onUpdate = jest.fn();
    render(<References {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    window.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ error: true }) })
    ) as any;

    const select = await screen.findByText("Select");
    const user = userEvent.setup();
    await user.click(select);
    await screen.findByText(
      "There was an error fetching the list of reference alerts",
      { exact: false }
    );
  });

  test("renders options on click and calls callback correctly", async () => {
    const onUpdate = jest.fn();
    render(<References {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const sent = new Date();
    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            error: false,
            alerts: [
              {
                id: "test",
                data: {
                  sender: "Sender",
                  sent: sent.toISOString(),
                  info: [{ headline: "Headline" }],
                },
              },
            ],
          }),
      })
    ) as any;

    const select = await screen.findByText("Select");
    const user = userEvent.setup();
    await user.click(select);
    const option = await screen.findByText(
      `Headline - sent ${sent.toISOString()} (test)`
    );
    await user.click(option);
    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      references: [`Sender,test,${sent.toISOString()}`],
    });
  });
});
