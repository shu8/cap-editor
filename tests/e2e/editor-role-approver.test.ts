import { beforeEach, describe, expect, test } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { formatDate } from "../../lib/helpers.client";
import { createUser, login } from "./helpers";

var document: ElementHandle<Element>;

describe("Editor: new alert (approver)", () => {
  beforeEach(async () => {
    await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["APPROVER"],
    });
    await login("foo@example.com");
    await page.goto(`${baseUrl}/editor`, { waitUntil: "networkidle0" });
    document = await getDocument(page);
  });

  test("cannot load editor for new alert", async () => {
    await queries.findByText(
      document,
      "Your account does not have permission to create new alerts",
      { exact: false }
    );
  });
});

describe("Editor: edit alert (approver)", () => {
  let alertId: string | undefined;

  beforeEach(async () => {
    const user = await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["APPROVER"],
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
      },
    });
    alertId = alert?.id;
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
    await queries.findByText(document, "Edit alert: metadata");
    await queries.findByText(document, alertId!);
    await queries.findByText(document, "Status");
    await queries.findByText(document, "Actual");
    await queries.findByText(document, "Message type");
    await queries.findByText(document, "Alert");

    // No 'references' should be shown initially
    const referencesField = await queries.queryByText(document, "References");
    expect(referencesField).toBeNull();
  });

  test("can edit draft alert", async () => {
    const statusSelector = await queries.findByText(document, "Actual");
    await statusSelector.click();
    await (await queries.findByText(document, "Exercise")).click();

    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();

    await (await queries.findByText(document, "Update draft")).click();
    await queries.findByText(document, "Alert successfully submitted.");

    expect(
      ((await prisma!.alert.findFirst())?.data as Prisma.JsonObject).status
    ).toEqual("Exercise");
  });

  test("can publish draft alert", async () => {
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();
    await (await queries.findByText(document, "Next")).click();

    const saveBtn = await queries.findByText(document, "Update draft");
    const multiBtnArrow = (await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    )) as ElementHandle;

    await multiBtnArrow!.asElement()!.click();
    const publishBtn = await queries.findByText(document, "Publish alert now");
    await publishBtn.click();
    await (await queries.findByText(document, "Publish alert now")).click();

    await queries.findByText(document, "Alert successfully submitted.");

    expect((await prisma!.alert.findFirst())?.status).toEqual("PUBLISHED");
  });
});
