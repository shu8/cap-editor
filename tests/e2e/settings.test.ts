import { beforeEach, describe, expect, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { createUser, login, mockNetworkResponse } from "./helpers";

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
    await queries.findByText(document, "Contact Address");
    await queries.findByText(document, "Web URL");
  });

  test("can update contact and web URL", async () => {
    const input = await queries.findByPlaceholderText(
      document,
      "e.g., metoffice@gov.uk"
    );
    await input.type("test@test.com");
    const saveBtns = await queries.findAllByText(document, "Save");
    await saveBtns[0].click();

    await page.waitForNavigation({ waitUntil: "networkidle0" });
    expect((await prisma?.alertingAuthority.findFirst())?.contact).toEqual(
      "test@test.com"
    );
  });
});

describe("Personal Details", () => {
  test("load section", async () => {
    await queries.findByText(document, "Personal Details");
    await queries.findByText(document, "Name");
    await queries.findByPlaceholderText(document, "Your name");
    await queries.findAllByText(document, "Save");
  });

  test("can update name", async () => {
    const input = await queries.findByPlaceholderText(document, "Your name");
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
    await queries.findByText(document, "Select");
  });

  test("loads alerting authorities", async () => {
    await mockNetworkResponse("GET", "/api/alertingAuthorities", {
      result: [
        {
          name: "Test AA",
          id: "aa",
          author: "aa@example.com",
          countryCode: "GB",
          polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
        },
      ],
    });

    const selector = await queries.findByText(document, "Select");
    await selector.click();
    await queries.findByText(document, "Test AA");
  });

  test("can join Other alerting authority", async () => {
    await mockNetworkResponse("GET", "/api/alertingAuthorities", {
      result: [
        {
          name: "Test AA",
          id: "aa",
          author: "aa@example.com",
          countryCode: "GB",
          polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
        },
      ],
    });

    const selector = await queries.findByText(document, "Select");
    await selector.click();
    await queries.findByText(document, "Test AA");
    const aa = await queries.findAllByText(document, "Other");
    await aa[1].click();

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
    expect(userAas!.length).toEqual(1);
    expect(userAas![0].alertingAuthorityId.startsWith("ifrc:"));
    expect(userAas![0].verified).toBeNull();
    expect(userAas![0].verificationToken).toBeTruthy();
  });
});
