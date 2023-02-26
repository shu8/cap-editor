import { Role } from "@prisma/client";
import { getDocument, queries } from "pptr-testing-library";
import quotedPrintable from "quoted-printable";

export const createUser = async (
  email: string,
  name: string,
  alertingAuthority: {
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
                id: name,
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

  await page.screenshot({ path: "./test.png" });
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
