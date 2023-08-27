import { beforeEach, describe, expect, test } from "@jest/globals";
import { User } from "@prisma/client";
import { randomUUID } from "crypto";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { formatDate } from "../../lib/helpers.client";
import {
  assertEditingPage,
  assertPrefilledEditingPage,
  clearInput,
  createUser,
  login,
} from "./helpers";

var document: ElementHandle<Element>;
var user: User | undefined;

async function createAlert() {
  const uuid = randomUUID();
  const from = new Date();
  const future = new Date();
  future.setDate(future.getDate() + 1);
  return await prisma?.alert.create({
    data: {
      id: uuid,
      userId: user!.id,
      alertingAuthorityId: "AA",
      status: "DRAFT",
      data: {
        identifier: uuid,
        sender: "foo@example.com",
        sent: formatDate(from),
        status: "Actual",
        msgType: "Alert",
        info: [
          {
            language: "eng",
            category: ["Geo"],
            event: "Flooding",
            responseType: ["Prepare"],
            urgency: "Immediate",
            severity: "Extreme",
            certainty: "Observed",
            onset: formatDate(from),
            expires: formatDate(future),
            senderName: "Alerting Authority",
            headline: "Headline text",
            description: "Description text",
            instruction: "Instruction text",
            parameter: [
              { valueName: "MULTI_LANGUAGE_GROUP_ID", value: "test-group-id" },
            ],
            resource: [],
            area: [],
          },
        ],
      },
    },
  });
}

describe("Homepage (logged out)", () => {
  test("loads homepage", async () => {
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    document = await getDocument(page);

    await queries.findByText(
      document,
      "The CAP Editor tool allows you to create public hazard and emergency alerts and immediately publish them to an XML-based feed."
    );
    await queries.findByText(
      document,
      "Register with your Alerting Authority",
      { exact: false }
    );
    await queries.findByText(
      document,
      "Compose and view Common Alerting Protocol (CAP) Public Alerts"
    );
    await queries.findByText(document, "Register");
    await queries.findByText(document, "Login");
  });
});

describe("Homepage (logged in)", () => {
  beforeEach(async () => {
    user = await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["COMPOSER"],
    });
    await login("foo@example.com");
    await page.goto(baseUrl, { waitUntil: "networkidle0" });
    document = await getDocument(page);
  });

  test("loads homepage", async () => {
    await queries.findByText(
      document,
      "The CAP Editor tool allows you to create public hazard and emergency alerts and immediately publish them to an XML-based feed."
    );

    await queries.findByText(
      document,
      "Compose and view Common Alerting Protocol (CAP) Public Alerts"
    );
    await queries.findByText(document, "foo@example.com");
    await queries.findByText(document, "composer");
    await queries.findByText(document, "Settings");
    await queries.findByText(document, "Logout");
    await queries.findByText(document, "Create alert");
    await queries.findByText(document, "published alerts");
    await queries.findByText(document, "draft alerts");
    await queries.findByText(document, "Export alerts");

    expect(await queries.queryByText(document, "Register")).toBeNull();
    expect(await queries.queryByText(document, "Login")).toBeNull();
    expect(
      await queries.queryByText(
        document,
        "Register with your Alerting Authority",
        { exact: false }
      )
    ).toBeNull();
  });

  test("alert category panels show no alerts", async () => {
    const publishedHeader = await queries.findByText(
      document,
      "published alerts"
    );
    await publishedHeader.click();
    await queries.findByText(document, "No alerts");

    const draftHeader = await queries.findByText(document, "draft alerts");
    await draftHeader.click();
    await queries.findAllByText(document, "No alerts");
  });

  test("shows alerts", async () => {
    await createAlert();

    await page.reload({ waitUntil: "networkidle0" });
    document = await getDocument(page);

    const draftHeader = await queries.findByText(document, "draft alerts");
    await draftHeader.click();

    await queries.findByText(document, "Headline text");
    await queries.findByText(document, "(Geo)");
    await queries.findByText(document, "View alert", { exact: false });
    await queries.findByText(document, "Use as template for new alert", {
      exact: false,
    });
    await queries.findByText(document, "Draft in new language", {
      exact: false,
    });
    await queries.findByText(document, "Edit alert", { exact: false });
    await queries.findByText(document, "Alert");
    await queries.findByText(document, "Actual");
    await queries.findByText(document, "Immediate");
    await queries.findByText(document, "Extreme");
    await queries.findByText(document, "Observed");
  });

  test("can click 'edit alert' to go to pre-filled editor with 'update draft' option", async () => {
    await createAlert();
    await page.reload({ waitUntil: "networkidle0" });
    document = await getDocument(page);

    const draftHeader = await queries.findByText(document, "draft alerts");
    await draftHeader.click();

    const editBtn = await queries.findByText(document, "Edit alert", {
      exact: false,
    });
    await editBtn.click();

    await page.waitForNavigation();
    document = await getDocument(page);

    await assertEditingPage(document);
    await assertPrefilledEditingPage(document);
    await queries.findByText(document, "Update draft");
  });

  test("can click 'use as template' to go to pre-filled editor with 'save as new' option", async () => {
    await createAlert();
    await page.reload({ waitUntil: "networkidle0" });
    document = await getDocument(page);

    const draftHeader = await queries.findByText(document, "draft alerts");
    await draftHeader.click();

    const templateBtn = await queries.findByText(
      document,
      "Use as template for new alert",
      {
        exact: false,
      }
    );
    await templateBtn.click();

    await page.waitForNavigation();
    document = await getDocument(page);

    await assertEditingPage(document);
    await assertPrefilledEditingPage(document);
    await queries.findByText(document, "Save draft");
  });

  test("can click 'draft in new language' to go to pre-filled editor with 'save as new' option and disabled fields", async () => {
    await createAlert();
    await page.reload({ waitUntil: "networkidle0" });
    document = await getDocument(page);

    const draftHeader = await queries.findByText(document, "draft alerts");
    await draftHeader.click();

    const newLanguageBtn = await queries.findByText(
      document,
      "Draft in new language",
      {
        exact: false,
      }
    );
    await newLanguageBtn.click();

    await page.waitForNavigation();
    document = await getDocument(page);

    await assertEditingPage(document);
    await assertPrefilledEditingPage(document);
    await queries.findByText(document, "Save draft");

    const statusField = await queries.findByLabelText(document, "Status", {
      selector: "input",
    });
    const statusFieldClasses = Object.values(
      await (await statusField.getProperty("classList")).jsonValue()
    );
    expect(statusFieldClasses.includes("rs-picker-toggle-read-only")).toEqual(
      true
    );

    const headlineField = await queries.findByLabelText(document, "Headline", {
      selector: "input",
    });
    const headlineFieldClasses = Object.values(
      await (await headlineField.getProperty("classList")).jsonValue()
    );
    expect(headlineFieldClasses.includes("rs-picker-toggle-read-only")).toEqual(
      false
    );
  });

  test("can click 'draft in new language' and save new alert with correct multi-language group id", async () => {
    await createAlert();
    await page.reload({ waitUntil: "networkidle0" });
    document = await getDocument(page);

    const draftHeader = await queries.findByText(document, "draft alerts");
    await draftHeader.click();

    const newLanguageBtn = await queries.findByText(
      document,
      "Draft in new language",
      {
        exact: false,
      }
    );
    await newLanguageBtn.click();

    await page.waitForNavigation();
    document = await getDocument(page);

    await assertEditingPage(document);
    await assertPrefilledEditingPage(document);
    await queries.findByText(document, "Save draft");

    const headlineField = await queries.findByLabelText(document, "Headline", {
      selector: "input",
    });
    await clearInput(headlineField);
    await headlineField.type("New language headline");

    const saveBtn = await queries.findByText(document, "Save draft");
    await saveBtn.click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts).toHaveLength(2);
    expect(alerts[1].status).toEqual("DRAFT");
    expect(alerts[1].data).toBeTruthy();
    expect(alerts[1].data.info[0].parameter).toHaveLength(2);
    expect(
      alerts[1].data.info[0].parameter.find(
        (p) => p.valueName === "MULTI_LANGUAGE_GROUP_ID"
      ).value
    ).toEqual("test-group-id");
  });
});
