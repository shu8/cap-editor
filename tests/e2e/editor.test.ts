import { beforeEach, describe, expect, test } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { formatDate } from "../../lib/helpers.client";
import {
  assertEditingPage,
  createUser,
  fillOutEditorForm,
  login,
} from "./helpers";

var document: ElementHandle<Element>;

describe("Editor: new alert", () => {
  beforeEach(async () => {
    await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["COMPOSER"],
    });
    await login("foo@example.com");
    await page.goto(`${baseUrl}/editor`, { waitUntil: "networkidle0" });
    document = await getDocument(page);
  });

  test("load editor", async () => {
    await assertEditingPage(document);

    // No 'references' should be shown initially
    const referencesField = await queries.queryByText(document, "References");
    expect(referencesField).toBeNull();
  });

  test("shows 'references' when type=update", async () => {
    // No 'references' should be shown initially
    const referencesField = await queries.queryByText(document, "References");
    expect(referencesField).toBeNull();

    await (await queries.findByText(document, "Type")).click();
    await (await queries.findByText(document, "Update")).click();
    await queries.findByText(document, "References");
  });

  test("alert can be filled out", async () => {
    await fillOutEditorForm(document);
  });
});

describe("Editor: edit alert", () => {
  beforeEach(async () => {
    const user = await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["COMPOSER"],
    });

    const uuid = randomUUID();
    const from = new Date();
    const future = new Date();
    future.setDate(future.getDate() + 1);
    const alert = await prisma?.alert.create({
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
              web: `https://example.com/feed/${uuid}`,
              contact: "foo@example.com",
              resource: [],
              area: [
                {
                  areaDesc: "England description",
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
      },
    });
    await login("foo@example.com");
    await page.goto(`${baseUrl}/editor/${alert!.id}`, {
      waitUntil: "networkidle0",
    });
    document = await getDocument(page);
  });

  test("cannot edit published alert", async () => {
    await prisma?.alert.updateMany({ data: { status: "PUBLISHED" } });
    await page.reload({ waitUntil: "networkidle0" });
    document = await getDocument(page);

    await queries.findByText(document, "You cannot edit a published alert", {
      exact: false,
    });
  });

  test("shows editing screen for draft alert", async () => {
    await assertEditingPage(document);

    // No 'references' should be shown initially
    const referencesField = await queries.queryByText(document, "References");
    expect(referencesField).toBeNull();
  });

  test("has alert data pre-filled", async () => {
    for (const string of [
      "Actual",
      "Alert",
      "Geophysical (e.g., landslide)",
      "Prepare",
      "English (eng)",
      "Immediate",
      "Extreme",
      "Observed",
    ]) {
      await queries.findByText(document, string, {
        selector: ".rs-picker-toggle-value,.rs-picker-value-item",
      });
    }

    for (const string of [
      "Headline text",
      "Flooding",
      "Description text",
      "Instruction text",
    ]) {
      await queries.findByDisplayValue(document, string);
    }
  });
});
