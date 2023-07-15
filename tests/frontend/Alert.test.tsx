import { describe, expect, test } from "@jest/globals";
import { i18n } from "@lingui/core";
import { I18nProvider } from "@lingui/react";
import { Alert as DBAlert } from "@prisma/client";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { randomUUID } from "crypto";

import Alert from "../../components/Alert";
import { formatDate } from "../../lib/helpers.client";
import { messages } from "../../locales/en/messages";

const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);
i18n.load({ en: messages });
i18n.activate("en");
const TestingProvider = ({ children }: any) => {
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={true}>
      {children}
    </I18nProvider>
  );
};

const uuid = randomUUID();
const from = new Date();
const future = new Date();
future.setDate(future.getDate() + 1);
const databaseAlert: DBAlert = {
  id: uuid,
  status: "PUBLISHED",
  userId: "user-id",
  alertingAuthorityId: "aa",
  data: {
    identifier: uuid,
    sender: "foo@example.com",
    sent: formatDate(from),
    status: "Actual",
    msgType: "Alert",
    info: [
      {
        language: "en",
        category: ["Geo"],
        event: "Flooding",
        responseType: ["Prepare"],
        urgency: "Immediate",
        severity: "Extreme",
        certainty: "Observed",
        onset: formatDate(from),
        expires: formatDate(future),
        senderName: "Alerting Authority",
        headline: "Headline",
        description: "Description",
        instruction: "Instruction",
        web: `https://example.com/feed/${uuid}`,
        contact: "foo@example.com",
        resource: [],
        area: [
          {
            areaDesc: "England",
            polygon: [
              [49.8858833313549, -6.36867904666016],
              [49.8858833313549, 1.75900208943311],
              [55.8041437929974, 1.75900208943311],
              [55.8041437929974, -6.36867904666016],
              [49.8858833313549, -6.36867904666016],
            ],
          },
        ],
      },
    ],
  },
};

describe("<Alert>", () => {
  test("renders published non-expired alert correctly", async () => {
    render(<Alert alert={databaseAlert} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("View alert ↗");
    await screen.findByText("Use as template for new alert →");
    await screen.findByText("Alert");
    await screen.findByText("Actual");
    await screen.findByText("Immediate");
    await screen.findByText("Observed");
    await screen.findByText("Extreme");
    await screen.findByText("Headline");
    await screen.findByText("(Geo)");
    await screen.findByText("Share on Social Media", { exact: false });

    expect(screen.queryByText("Edit alert")).toEqual(null);
  });

  test("renders published expired alert correctly", async () => {
    const alert = { ...databaseAlert };
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() - 1);
    alert.data.info[0].expires = expiry;

    render(<Alert alert={alert} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("View alert ↗");
    await screen.findByText("Use as template for new alert →");
    await screen.findByText("Alert");
    await screen.findByText("Actual");
    await screen.findByText("Immediate");
    await screen.findByText("Observed");
    await screen.findByText("Extreme");
    await screen.findByText("Headline");
    await screen.findByText("(Geo)");

    expect(screen.queryByText("Edit alert")).toEqual(null);
    expect(
      screen.queryByText("Share on Social Media", { exact: false })
    ).toEqual(null);
  });

  test("renders draft alert correctly", async () => {
    const alert = { ...databaseAlert };
    alert.status = "DRAFT";
    render(<Alert alert={alert} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("View alert ↗");
    await screen.findByText("Use as template for new alert →");
    await screen.findByText("Edit alert 🖉");
    await screen.findByText("Alert");
    await screen.findByText("Actual");
    await screen.findByText("Immediate");
    await screen.findByText("Observed");
    await screen.findByText("Extreme");
    await screen.findByText("Headline");
    await screen.findByText("(Geo)");

    expect(
      screen.queryByText("Share on Social Media", { exact: false })
    ).toEqual(null);
  });

  test("renders template alert correctly", async () => {
    const alert = { ...databaseAlert };
    alert.status = "TEMPLATE";
    render(<Alert alert={alert} />, {
      wrapper: TestingProvider,
    });

    await screen.findByText("View alert ↗");
    await screen.findByText("Use as template for new alert →");
    await screen.findByText("Edit alert 🖉");
    await screen.findByText("Alert");
    await screen.findByText("Actual");
    await screen.findByText("Immediate");
    await screen.findByText("Observed");
    await screen.findByText("Extreme");
    await screen.findByText("Headline");
    await screen.findByText("(Geo)");

    expect(
      screen.queryByText("Share on Social Media", { exact: false })
    ).toEqual(null);
  });
});
