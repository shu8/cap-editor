import { beforeEach, describe, expect, test } from "@jest/globals";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import quotedPrintable from "quoted-printable";

var document: ElementHandle<Element>;
beforeEach(async () => {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

describe("Login", () => {
  test("load page", async () => {
    expect((await queries.findAllByText(document, "Login")).length).toEqual(2);
    await queries.findByText(document, "Email");
    await queries.findByText(document, "Next");
  });

  test("redirects to register page when logging in with new email", async () => {
    const emailInput = await queries.findByPlaceholderText(
      document,
      "me@example.com"
    );
    await emailInput.type("foo@example.com");

    const loginButton = await queries.findByText(document, "Next");
    await loginButton.click();

    await page.waitForNavigation();

    document = await getDocument(page);
    await queries.findAllByText(document, "Register");
    await queries.findByText(document, "Name");
  });

  test("can register after redirecting to register page when logging in with new email", async () => {
    const emailInput = await queries.findByPlaceholderText(
      document,
      "me@example.com"
    );
    await emailInput.type("foo@example.com");

    const loginButton = await queries.findByText(document, "Next");
    await loginButton.click();

    await page.waitForNavigation();

    document = await getDocument(page);
    await queries.findAllByText(document, "Register");
    await queries.findByText(document, "Name");
    const nameInput = await queries.findByPlaceholderText(
      document,
      "Your name"
    );
    await nameInput.type("Foo");

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

  test("can register after redirection and then login with email link", async () => {
    // Enter email in login screen before registering
    const emailInput = await queries.findByPlaceholderText(
      document,
      "me@example.com"
    );
    await emailInput.type("foo@example.com");

    // Click login button
    // Get redirected to register page with email pre - filled
    const loginButton = await queries.findByText(document, "Next");
    await loginButton.click();
    await page.waitForNavigation();
    document = await getDocument(page);

    // Enter name
    await queries.findAllByText(document, "Register");
    await queries.findByText(document, "Name");
    const nameInput = await queries.findByPlaceholderText(
      document,
      "Your name"
    );
    await nameInput.type("Foo");

    // Click register button
    const registerButton = (
      await queries.findAllByText(document, "Register")
    )[2];
    await registerButton.click();

    // Get success toast
    await queries.findByText(document, "Registration successful", {
      exact: false,
    });

    // Now go to login page
    await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle0" });
    document = await getDocument(page);

    // Enter email and click login button
    await (
      await queries.findByPlaceholderText(document, "me@example.com")
    ).type("foo@example.com");
    await (await queries.findByText(document, "Next")).click();

    // Get redirected to 'please check your email page'
    await page.waitForNavigation({ waitUntil: "networkidle0" });
    document = await getDocument(page);
    await queries.findByText(document, "Please check your email", {
      exact: false,
    });

    // Make sure email was sent
    const emails = await fetch("http://localhost:8025/api/v2/messages").then(
      (res) => res.json()
    );
    expect(emails).toBeTruthy();
    expect(emails.items.length).toEqual(1);
    expect(emails.items[0].Raw.To[0]).toEqual("foo@example.com");
    const loginUrlMatch = emails.items[0].Raw.Data.match(
      /(http[\s\S]*?\n\s*\n)/m
    );

    // Extract login URL from email
    const loginUrl = quotedPrintable.decode(loginUrlMatch[1]);
    expect(loginUrl).toBeTruthy();

    // Go to login URL
    await page.goto(decodeURI(loginUrl), { waitUntil: "networkidle0" });
    document = await getDocument(page);

    // Make sure we are now logged in
    await queries.findByText(document, "published alerts");
    await queries.findByText(document, "draft alerts");
    await queries.findByText(document, "template alerts");
    await queries.findByText(document, "expired alerts");
  });
});
