import { Role } from "@prisma/client";
import { getDocument, queries } from "pptr-testing-library";
import { ElementHandle } from "puppeteer";
import quotedPrintable from "quoted-printable";

export const createUser = async (
  email: string,
  name: string,
  alertingAuthority?: {
    verified: Date | null;
    name: string;
    roles: Role[];
  }
) => {
  return await prisma?.user.create({
    data: {
      email,
      name,
      ...(alertingAuthority && {
        AlertingAuthorities: {
          create: {
            AlertingAuthority: {
              create: {
                name: alertingAuthority.name,
                author: "aa@example.com",
                id: alertingAuthority.name,
                countryCode: "GBR",
                polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
              },
            },
            verified: alertingAuthority.verified,
            roles: alertingAuthority.roles,
          },
        },
      }),
    },
  });
};

export const getEmails = async () => {
  return await fetch("http://localhost:8025/api/v2/messages").then((res) =>
    res.json()
  );
};

export const login = async (email: string) => {
  await page.goto(`${baseUrl}/login`, { waitUntil: "networkidle0" });
  const document = await getDocument(page);

  // Enter email and click login button
  await (
    await queries.findByPlaceholderText(document, "me@example.com")
  ).type(email);
  await (await queries.findByText(document, "Next")).click();
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // Get login email
  const emails = await getEmails();
  const loginUrlMatch = emails.items[emails.items.length - 1].Raw.Data.match(
    /(http[\s\S]*?\n\s*\n)/m
  );

  // Extract login URL from email
  const loginUrl = quotedPrintable.decode(loginUrlMatch[1]);

  // Go to login URL to login
  await page.goto(loginUrl);
  await page.waitForNavigation({ waitUntil: "networkidle0" });
};

export const mockNetworkResponse = async (
  method: string,
  path: string,
  data: any
) => {
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    if (request.url().endsWith(path) && request.method() === method) {
      request.respond({
        contentType: "application/json",
        body: JSON.stringify(data),
      });
      return;
    }

    request.continue();
  });
};

export async function fillOutEditorForm(document: ElementHandle<Element>) {
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
