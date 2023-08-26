import { beforeEach, describe, expect, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { clearInput, createUser, login, mockNetworkResponse } from "./helpers";

var document: ElementHandle<Element>;
beforeEach(async () => {
  await createUser("foo@example.com", "Foo", {
    verified: new Date(),
    name: "AA",
    roles: ["ADMIN"],
  });
  await login("foo@example.com");
  await page.goto(`${baseUrl}/settings`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("AA settings", () => {
  test("load section", async () => {
    await queries.findByText(document, "Alerting Authority settings");
    await queries.findByText(document, "Default Timezone");
    await queries.findByText(document, "Severity-certainty matrix enabled");
    expect(await queries.findAllByText(document, "Save")).toHaveLength(2);
  });

  test("can update timezone and severity-certainty matrix", async () => {
    const input = await queries.findByPlaceholderText(
      document,
      "e.g., Europe/London"
    );
    await clearInput(input);
    await input.type("Europe/London");

    const toggle = await queries.findByText(
      document,
      "Severity-certainty matrix enabled"
    );
    await toggle.click();

    const saveBtns = await queries.findAllByText(document, "Save");
    await saveBtns[0].click();

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    const aa = await prisma?.alertingAuthority.findFirst();

    expect(aa).toBeTruthy();
    expect(aa!.defaultTimezone).toEqual("Europe/London");
    expect(aa!.severityCertaintyMatrixEnabled).toEqual(true);
  });
});

describe("Personal Details", () => {
  test("load section", async () => {
    await queries.findByText(document, "Personal Details");
    await queries.findByText(document, "Name");
    await queries.findByPlaceholderText(document, "Your name");
    expect(await queries.findAllByText(document, "Save")).toHaveLength(2);
  });

  test("can update name", async () => {
    const input = await queries.findByPlaceholderText(document, "Your name");
    await clearInput(input);
    await input.type("New name");

    const saveBtns = await queries.findAllByText(document, "Save");
    await saveBtns[1].click();
    await page.waitForNavigation({ waitUntil: "networkidle0" });

    expect((await prisma?.user.findFirst())?.name).toEqual("New name");
  });
});

describe("Connect to Alerting Authorities", () => {
  test("load section", async () => {
    await queries.findByText(document, "Connect to Alerting Authorities");
    await queries.findByText(
      document,
      "Select, or type in the name of, your Alerting Authority"
    );
  });

  test("loads alerting authorities", async () => {
    await mockNetworkResponse([
      {
        method: "GET",
        path: "/api/alertingAuthorities",
        data: {
          result: [
            {
              name: "Test AA",
              id: "aa",
              author: "aa@example.com",
              countryCode: "GB",
              polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
            },
          ],
        },
      },
    ]);

    const selector = await queries.findByText(
      document,
      "Select, or type in the name of, your Alerting Authority"
    );
    await selector.click();
    await queries.findByText(document, "Test AA");
  });

  test("can join Other alerting authority", async () => {
    await mockNetworkResponse([
      {
        method: "GET",
        path: "/api/alertingAuthorities",
        data: {
          result: [
            {
              name: "Test AA",
              id: "aa",
              author: "aa@example.com",
              countryCode: "GB",
              polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
            },
          ],
        },
      },
    ]);

    const selector = await queries.findByText(
      document,
      "Select, or type in the name of, your Alerting Authority"
    );
    await selector.click();

    await selector.type("Another AA");
    await selector.press("Enter");

    const submitBtn = await queries.findByText(
      document,
      "Connect to Alerting Authority"
    );
    await submitBtn.click();

    await queries.findByText(
      document,
      "Your request has been sent to your Alerting Authority",
      { exact: false }
    );

    const userAas = await prisma?.userAlertingAuthorities.findMany();
    expect(userAas).toBeTruthy();
    expect(userAas!.length).toEqual(2);
    expect(userAas![1].alertingAuthorityId.startsWith("ifrc:"));
    expect(userAas![1].verified).toBeNull();
    expect(userAas![1].verificationToken).toBeTruthy();
  });
});
