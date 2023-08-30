import { beforeEach, describe, expect, test } from "@jest/globals";
import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";
import { DateTime } from "luxon";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { formatDate } from "../../lib/helpers.client";
import {
  createUser,
  fillOutEditorForm,
  login
} from "./helpers";

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

  test("correct submit actions shown for approver", async () => {
    await queries.findByText(document, "Cancel");
    await queries.findByText(document, "Save draft");
    await queries.findByText(document, "Publish");
  });

  test("new alert can be saved as draft by approver", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Save draft");
    await saveBtn.click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts).toHaveLength(1);
    expect(alerts[0].status).toEqual("DRAFT");
    expect(alerts[0].data).toBeTruthy();
    expect(alerts[0].data.info[0].resource).toHaveLength(1);
    expect(alerts[0].data.info[0].area[0].polygon).toHaveLength(1);
    expect(alerts[0].data.info[0].area[0].geocode).toBeFalsy();
    expect(alerts[0].data.info[0].area[0].circle).toBeFalsy();
  });

  test("new alert can be published by approver", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Publish");
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await saveBtn.click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts).toHaveLength(1);
    expect(alerts[0].status).toEqual("PUBLISHED");
    expect(alerts[0].data).toBeTruthy();
    expect(alerts[0].data.info[0].resource).toHaveLength(1);
    expect(alerts[0].data.info[0].area[0].polygon).toHaveLength(1);
    expect(alerts[0].data.info[0].area[0].geocode).toBeFalsy();
    expect(alerts[0].data.info[0].area[0].circle).toBeFalsy();
  });

  test("timezone is saved correctly", async () => {
    await fillOutEditorForm(document);

    const saveBtn = await queries.findByText(document, "Save draft");
    await saveBtn.click();
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts).toHaveLength(1);

    const tomorrowStart = DateTime.now().plus({ days: 1 }).startOf("day");
    const tomorrowEnd = DateTime.now().plus({ days: 1 }).endOf("day");
    expect(alerts[0].data.info[0].onset).toEqual(
      `${tomorrowStart.toFormat("yyyy-MM-dd'T'HH:mm:ss")}+05:30`
    );
    expect(alerts[0].data.info[0].expires).toEqual(
      `${tomorrowEnd.toFormat("yyyy-MM-dd'T'HH:mm:ss")}+05:30`
    );
  });
});

describe("Editor: edit alert (approver)", () => {
  beforeEach(async () => {
    const user = await createUser("foo@example.com", "Foo", {
      verified: new Date(),
      name: "AA",
      roles: ["APPROVER"],
    });

    const uuid = randomUUID();
    const uuidXml = randomUUID();
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
          identifier: uuidXml,
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

  test("correct submit actions shown for approver", async () => {
    await queries.findByText(document, "Cancel");
    await queries.findByText(document, "Update draft");
    await queries.findByText(document, "Publish");
  });

  test("can edit draft alert", async () => {
    await (await queries.findByText(document, "Status")).click();
    await (await queries.findByText(document, "Exercise")).click();

    await (await queries.findByText(document, "Update draft")).click();
    await queries.findByText(document, "Alert successfully submitted.");

    expect(
      ((await prisma!.alert.findFirst())?.data as Prisma.JsonObject).status
    ).toEqual("Exercise");
  });

  test("can publish draft alert", async () => {
    const publishBtn = await queries.findByText(document, "Publish");
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });
    await publishBtn.click();
    await queries.findByText(document, "Alert successfully submitted.");

    expect((await prisma!.alert.findFirst())?.status).toEqual("PUBLISHED");
  });
});
