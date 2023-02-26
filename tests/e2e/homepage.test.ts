import { beforeEach, describe, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";

var document: ElementHandle<Element>;
beforeEach(async () => {
  await page.goto(`${baseUrl}`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("Homepage", () => {
  test("load page", async () => {
    await queries.findByText(document, "Register");
    await queries.findByText(document, "Login");
    await queries.findByText(
      document,
      "Register with your Alerting Authority",
      { exact: false }
    );
  });
});
