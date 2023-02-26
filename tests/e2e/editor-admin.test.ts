import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { createUser, login } from "./helpers";

var document: ElementHandle<Element>;
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

async function fillOutEditorForm() {
  const [statusInput, messageTypeInput, scopeInput] =
    await queries.findAllByText(document, "Select");

  await statusInput.click();
  await (await queries.findByText(document, "Actual")).click();

  await messageTypeInput.click();
  await (await queries.findByText(document, "Alert")).click();

  await scopeInput.click();
  await (await queries.findByText(document, "Public")).click();

  await (await queries.findByText(document, "Next")).click();

  await (await queries.findByText(document, "Rescue & recovery")).click();
  await (await queries.findByText(document, "Next")).click();

  await (await queries.findByText(document, "Select")).click();
  await (
    await queries.findByText(document, "England", { exact: false })
  ).click();
  await (await queries.findByText(document, "Next")).click();

  const [severitySelector, certaintySelector] = await queries.findAllByText(
    document,
    "Choose"
  );

  await severitySelector.click();
  await (await queries.findByText(document, "Severe")).click();

  await certaintySelector.click();
  await (await queries.findByText(document, "Likely")).click();

  await (await queries.findAllByText(document, "Immediate"))[0].click();

  await (await queries.findByText(document, "Select")).click();
  await (await queries.findByText(document, "Prepare")).click();

  await (await queries.findByText(document, "Next")).click();

  const inputs = await queries.findAllByRole(document, "textbox");
  await inputs[0].type("Flooding");
  await inputs[1].type("Headline");
  await inputs[2].type("Description");
  await inputs[3].type("Instruction");

  await (await queries.findByText(document, "Next")).click();
}

describe("Editor: new alert (admin)", () => {
  test("load editor", async () => {
    await queries.findByText(document, "New alert: metadata");
    await queries.findByText(document, "Status");
    await queries.findByText(document, "Message type");
    await queries.findByText(document, "Scope");
    await queries.findByText(document, "References");
  });

  test("correct alert submit actions shown for admin", async () => {
    await fillOutEditorForm();

    const saveBtn = await queries.findByText(document, "Save as draft");
    const multiBtnArrow = await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    );

    await multiBtnArrow!.asElement()!.click();
    await queries.findAllByText(document, "Save as draft");
    await queries.findByText(document, "Save as template");
    await queries.findByText(document, "Publish alert now");
  });

  test("new alert can be saved as draft by admin", async () => {
    await fillOutEditorForm();

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
    await fillOutEditorForm();

    const saveBtn = await queries.findByText(document, "Save as draft");
    const multiBtnArrow = await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    );

    await multiBtnArrow!.asElement()!.click();
    const saveTemplateBtn = await queries.findByText(
      document,
      "Save as template"
    );
    await saveTemplateBtn.click();

    await (await queries.findByText(document, "Save as template")).click();
    await page.screenshot({ path: "./test.png" });
    await queries.findByText(document, "Alert successfully submitted.");

    const alerts = await prisma!.alert.findMany();
    expect(alerts).toBeTruthy();
    expect(alerts.length).toEqual(1);
    expect(alerts[0].status).toEqual("TEMPLATE");
    expect(alerts[0].data).toBeTruthy();
  });

  test("new alert can be published by admin", async () => {
    await fillOutEditorForm();

    const saveBtn = await queries.findByText(document, "Save as draft");
    const multiBtnArrow = await saveBtn.evaluateHandle(
      (el) => el.nextElementSibling
    );

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
