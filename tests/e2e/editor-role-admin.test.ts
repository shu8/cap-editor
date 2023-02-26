import { beforeEach, describe, expect, test } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { formatDate } from "../../lib/helpers.client";
import { createUser, fillOutEditorForm, login } from "./helpers";

var document: ElementHandle<Element>;

describe("Editor: new alert (admin)", () => {
  beforeEach(async () => {
    await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["ADMIN"],
    });
    await login("foo@example.com");
    await page.goto(`${baseUrl}/editor`, { waitUntil: "networkidle0" });
    document = await getDocument(page);
  });

  test("load editor", async () => {
    await queries.findByText(document, "New alert: metadata");
    await queries.findByText(document, "Status");
    await queries.findByText(document, "Message type");
    await queries.findByText(document, "Scope");
    await queries.findByText(document, "References");
  });

  test("correct alert submit actions shown for admin", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Save as draft");
    const multiBtnArrow = (await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    )) as ElementHandle;

    await multiBtnArrow!.asElement()!.click();
    await queries.findAllByText(document, "Save as draft");
    await queries.findByText(document, "Save as template");
    await queries.findByText(document, "Publish alert now");
  });

  test("new alert can be saved as draft by admin", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Save as draft");
    await saveBtn.click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts.length).toEqual(1);
    expect(alerts[0].status).toEqual("DRAFT");
    expect(alerts[0].data).toBeTruthy();
  });

  test("new alert can be saved as template by admin", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Save as draft");
    const multiBtnArrow = (await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    )) as ElementHandle;

    await multiBtnArrow!.asElement()!.click();
    const saveTemplateBtn = await queries.findByText(
      document,
      "Save as template"
    );
    await saveTemplateBtn.click();

    await (await queries.findByText(document, "Save as template")).click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts.length).toEqual(1);
    expect(alerts[0].status).toEqual("TEMPLATE");
    expect(alerts[0].data).toBeTruthy();
  });

  test("new alert can be published by admin", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Save as draft");
    const multiBtnArrow = (await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    )) as ElementHandle;

    await multiBtnArrow!.asElement()!.click();
    const saveTemplateBtn = await queries.findByText(
      document,
      "Publish alert now"
    );
    await saveTemplateBtn.click();
    await (await queries.findByText(document, "Publish alert now")).click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts.length).toEqual(1);
    expect(alerts[0].status).toEqual("PUBLISHED");
    expect(alerts[0].data).toBeTruthy();
  });
});

describe("Editor: edit alert (admin)", () => {
  let alertId: string | undefined;

  beforeEach(async () => {
    const user = await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["ADMIN"],
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
          scope: "Public",
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
    await queries.findByText(document, "Scope");
    await queries.findByText(document, "Public");
    await queries.findByText(document, "References");
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
