import { beforeEach, describe, expect, jest, test } from "@jest/globals";
import { randomUUID } from "crypto";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import { hash } from "../../lib/helpers.server";
import { createUser } from "./helpers";

var document: ElementHandle<Element>;
beforeEach(async () => {
  await page.goto(`${baseUrl}/verify`, { waitUntil: "networkidle0" });
  document = await getDocument(page);
});

jest.setTimeout(10000);

describe("Verify", () => {
  test("load page without token query param", async () => {
    await queries.findByText(
      document,
      "Your verification link is invalid or expired."
    );
  });

  test("load page with non-existent token", async () => {
    await page.goto(`${baseUrl}/verify?token=foo`, {
      waitUntil: "networkidle0",
    });
    document = await getDocument(page);
    await queries.findByText(
      document,
      "Your verification link is invalid or expired."
    );
  });

  test("load page with valid token", async () => {
    const user = await createUser("foo@example.com", "Foo");
    const token = randomUUID();
    await prisma?.userAlertingAuthorities.create({
      data: {
        User: { connect: { id: user!.id } },
        verificationToken: hash(token),
        AlertingAuthority: {
          create: {
            author: "aa@example.com",
            id: "ifrc:aa",
            name: "AA",
          },
        },
      },
    });
    await page.goto(`${baseUrl}/verify?token=${token}`, {
      waitUntil: "networkidle0",
    });
    document = await getDocument(page);

    await queries.findByText(
      document,
      "The following user has requested to register with the CAP Editor",
      { exact: false }
    );
  });

  test("can reject verification", async () => {
    const user = await createUser("foo@example.com", "Foo");
    const token = randomUUID();
    await prisma?.userAlertingAuthorities.create({
      data: {
        User: { connect: { id: user!.id } },
        verificationToken: hash(token),
        AlertingAuthority: {
          create: {
            author: "aa@example.com",
            id: "aa",
            name: "AA",
          },
        },
      },
    });
    await page.goto(`${baseUrl}/verify?token=${token}`, {
      waitUntil: "networkidle0",
    });
    document = await getDocument(page);

    await queries.findByText(
      document,
      "The following user has requested to register with the CAP Editor",
      { exact: false }
    );

    const rejectBtn = await queries.findByText(
      document,
      "Do not activate their account",
      { exact: false }
    );
    await rejectBtn.click();

    await queries.findByText(document, "Account successfully rejected", {
      exact: false,
    });

    expect((await prisma!.userAlertingAuthorities.findMany()).length).toEqual(
      0
    );
  });

  test("can approve verification", async () => {
    const user = await createUser("foo@example.com", "Foo");
    const token = randomUUID();
    await prisma?.userAlertingAuthorities.create({
      data: {
        User: { connect: { id: user!.id } },
        verificationToken: hash(token),
        AlertingAuthority: {
          create: {
            author: "aa@example.com",
            id: "aa",
            name: "AA",
          },
        },
      },
    });
    await page.goto(`${baseUrl}/verify?token=${token}`, {
      waitUntil: "networkidle0",
    });
    document = await getDocument(page);

    await queries.findByText(
      document,
      "The following user has requested to register with the CAP Editor",
      { exact: false }
    );

    const acceptBtn = await queries.findByText(
      document,
      "Yes, this user is part of my Alerting Authority",
      { exact: false }
    );
    await acceptBtn.click();

    const selector = await queries.findByText(document, "Select role(s)", {
      exact: false,
    });
    await selector.click();
    const admin = await queries.findByText(document, "Admin");
    await admin.click();

    await (await queries.findByText(document, "User Roles")).click();

    const verifyBtn = await queries.findByText(document, "Approve this user");
    await verifyBtn.click();

    await queries.findByText(document, "Account successfully approved", {
      exact: false,
    });

    expect(
      (await prisma!.userAlertingAuthorities.findFirst())?.verified
    ).toBeTruthy();
  });

  test("can approve verification for Other AA", async () => {
    const user = await createUser("foo@example.com", "Foo");
    const token = randomUUID();
    await prisma?.userAlertingAuthorities.create({
      data: {
        User: { connect: { id: user!.id } },
        verificationToken: hash(token),
        AlertingAuthority: {
          create: {
            author: "aa@example.com",
            id: "ifrc:aa",
            name: "AA",
          },
        },
      },
    });
    await page.goto(`${baseUrl}/verify?token=${token}`, {
      waitUntil: "networkidle0",
    });
    document = await getDocument(page);

    await queries.findByText(
      document,
      "The following user has requested to register with the CAP Editor",
      { exact: false }
    );

    const acceptBtn = await queries.findByText(
      document,
      "Yes, this user is part of my Alerting Authority",
      { exact: false }
    );
    await acceptBtn.click();

    const input = await queries.findByPlaceholderText(
      document,
      "e.g., Bermuda"
    );
    await input.type("Other AA");

    const selector = await queries.findByText(document, "Select role(s)", {
      exact: false,
    });
    await selector.click();
    const admin = await queries.findByText(document, "Admin");
    await admin.click();

    await (await queries.findByText(document, "User Roles")).click();

    const verifyBtn = await queries.findByText(document, "Approve this user");
    await verifyBtn.click();

    await queries.findByText(document, "Account successfully approved", {
      exact: false,
    });

    expect(
      (await prisma!.userAlertingAuthorities.findFirst())?.verified
    ).toBeTruthy();
  });
});
