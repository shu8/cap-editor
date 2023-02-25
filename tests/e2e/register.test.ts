import { beforeEach, describe, expect, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";

var document: ElementHandle<Element>;
beforeEach(async () => {
  await page.goto(`${baseUrl}/register`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("Register", () => {
  test("load page", async () => {
    expect((await queries.findAllByText(document, "Register")).length).toEqual(
      3
    );
    await queries.findByText(document, "Name");
    await queries.findByText(document, "Email");
  });

  test("can register", async () => {
    const nameInput = await queries.findByPlaceholderText(
      document,
      "Your name"
    );
    await nameInput.type("Foo");

    const emailInput = await queries.findByPlaceholderText(
      document,
      "me@example.com"
    );
    await emailInput.type("foo@example.com");

    const registerButton = (
      await queries.findAllByText(document, "Register")
    )[2];
    await registerButton.click();

    await queries.findByText(document, "Registration successful", {
      exact: false,
    });

    const users = await prisma?.user.findMany();
    expect(users?.length).toEqual(1);
    expect(users![0].name).toEqual("Foo");
    expect(users![0].email).toEqual("foo@example.com");
  });
});
