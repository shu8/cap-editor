import { getDocument, queries } from "pptr-testing-library";
import quotedPrintable from "quoted-printable";

export const createUser = async (email: string, name: string) => {
  await prisma?.user.create({
    data: { email, name },
  });
};

export const login = async (email: string) => {
  await page.goto(`${baseUrl}/login`);
  const document = await getDocument(page);

  // Enter email and click login button
  await (
    await queries.findByPlaceholderText(document, "me@example.com")
  ).type(email);
  await (await queries.findByText(document, "Next")).click();
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  // Get login email
  const emails = await fetch("http://localhost:8025/api/v2/messages").then(
    (res) => res.json()
  );
  const loginUrlMatch = emails.items[emails.items.length - 1].Raw.Data.match(
    /(http[\s\S]*?\n\s*\n)/m
  );

  // Extract login URL from email
  const loginUrl = quotedPrintable.decode(loginUrlMatch[1]);

  // Go to login URL to login
  await page.goto(loginUrl);
  await page.waitForNavigation({ waitUntil: "networkidle0" });
};

export const mockNetworkResponse = async (method, path, data) => {
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
