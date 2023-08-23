import { describe, expect, jest, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Resources } from "../../../components/editor/fields";
import { messages } from "../../../locales/en/messages";
import { Form } from "rsuite";
import userEvent from "@testing-library/user-event";
import { defaultFormData } from "../helpers";

i18n.load({ en: messages });
i18n.activate("en");
const TestingProvider = ({ children }: any) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
      <Form>{children}</Form>
    </I18nProvider>
  );
};

const props = { alertData: { ...defaultFormData, resources: [] } };

describe("<Resources>", () => {
  test("renders correctly", async () => {
    const onUpdate = jest.fn();
    render(<Resources {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("Resources");
    await screen.findByText("Add URL?");
    await screen.findByText("No resources added yet");
  });

  test("renders resources correctly", async () => {
    const onUpdate = jest.fn();
    render(
      <Resources
        alertData={{
          ...defaultFormData,
          resources: [
            {
              resourceDesc: "Desc",
              uri: "https://example.com",
              mimeType: "text/html",
            },
          ],
        }}
        onUpdate={onUpdate}
      />,
      {
        wrapper: TestingProvider,
      }
    );

    await screen.findByText("Resources");
    await screen.findByText("Add URL?");
    await screen.findByText("Desc: https://example.com", {
      exact: false,
    });
  });

  test("shows and hides form on click", async () => {
    const onUpdate = jest.fn();
    render(<Resources {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    const user = userEvent.setup();
    const addBtn = await screen.findByText("Add URL?");
    await user.click(addBtn);

    await screen.findByText("Description");
    await screen.findByText("URL");
    await screen.findByText("Save");

    expect(await screen.findAllByRole("textbox")).toHaveLength(2);

    const cancelBtn = await screen.findByText("Cancel");
    await user.click(cancelBtn);
    expect(screen.queryAllByRole("textbox")).toHaveLength(0);
  });

  test("handles error on submit of form", async () => {
    const onUpdate = jest.fn();
    render(<Resources {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    window.fetch = jest.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ error: true }) })
    ) as any;

    const user = userEvent.setup();
    const addBtn = await screen.findByText("Add URL?");
    await user.click(addBtn);

    const inputs = await screen.findAllByRole("textbox");
    await user.type(inputs[0], "Description");
    await user.type(inputs[1], "URL");

    const saveBtn = await screen.findByText("Save");
    await user.click(saveBtn);

    await screen.findByText(
      "There was an error accessing one or more resources. They may be currently unavailable."
    );
  });

  test("calls callback on mime type fetch success correctly", async () => {
    const onUpdate = jest.fn();
    render(<Resources {...props} onUpdate={onUpdate} />, {
      wrapper: TestingProvider,
    });

    window.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ error: false, mime: "text/html" }),
      })
    ) as any;

    const user = userEvent.setup();
    const addBtn = await screen.findByText("Add URL?");
    await user.click(addBtn);

    const inputs = await screen.findAllByRole("textbox");
    await user.type(inputs[0], "Description");
    await user.type(inputs[1], "URL");

    const saveBtn = await screen.findByText("Save");
    await user.click(saveBtn);

    expect(onUpdate).toBeCalledTimes(1);
    expect(onUpdate).toBeCalledWith({
      resources: [
        { resourceDesc: "Description", uri: "URL", mimeType: "text/html" },
      ],
    });
  });
});
