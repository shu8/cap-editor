import { expect } from "@jest/globals";
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
    polygon?: string | null;
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
                polygon:
                  typeof alertingAuthority.polygon === "undefined"
                    ? "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8"
                    : alertingAuthority.polygon,
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
  mockRequests: {
    method: string;
    path: string;
    data: any;
  }[]
) => {
  await page.setRequestInterception(true);
  page.on("request", async (request) => {
    if (request.isInterceptResolutionHandled()) return;

    for (const r of mockRequests) {
      if (request.url().endsWith(r.path) && request.method() === r.method) {
        await request.respond({
          contentType: "application/json",
          body: JSON.stringify(r.data),
        });
        return;
      }
    }

    request.continue();
  });
};

// [How to delete existing text from input using Puppeteer?](https://stackoverflow.com/a/66750133)
export const clearInput = async (input: ElementHandle) => {
  await input.click({ clickCount: 3 });
  await page.keyboard.press("Backspace");
};

export async function fillOutEditorForm(document: ElementHandle<Element>) {
  await mockNetworkResponse([
    {
      method: "GET",
      path: "/geojson-regions",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            id: "England",
            properties: { ADMIN: "England", ISO_A3: "GBR" },
            geometry: {
              type: "Polygon",
              coordinates: [
                [
                  [-6.36867904666016, 49.8858833313549],
                  [1.75900208943311, 49.8858833313549],
                  [1.75900208943311, 55.8041437929974],
                  [-6.36867904666016, 55.8041437929974],
                  [-6.36867904666016, 49.8858833313549],
                ],
              ],
            },
          },
        ],
      },
    },
    {
      method: "GET",
      path: "/api/mime",
      data: { error: false, mime: "text/html" },
    },
  ]);

  for (const label of [
    "Headline",
    "Event",
    "Description",
    "Instruction",
    "Contact",
    "Web",
  ]) {
    const el = await queries.findByText(document, label);
    await el.click();
    await page.keyboard.type(label === "Web" ? "https://example.com" : label);
  }

  await (await queries.findByText(document, "Status")).click();
  await (await queries.findByText(document, "Actual")).click();

  await (await queries.findByText(document, "Type")).click();
  await (await queries.findByText(document, "Alert")).click();

  await (await queries.findByText(document, "Category")).click();
  await (await queries.findByText(document, "Rescue & recovery")).click();
  await page.keyboard.press("Escape");

  await (await queries.findByText(document, "Response")).click();
  await (await queries.findByText(document, "Shelter")).click();
  await page.keyboard.press("Escape");

  await (await queries.findByText(document, "Severity")).click();
  await (await queries.findByText(document, "Severe")).click();

  await (await queries.findByText(document, "Certainty")).click();
  await (await queries.findByText(document, "Likely")).click();

  await (await queries.findByText(document, "Urgency")).click();
  await (await queries.findByText(document, "Immediate")).click();

  await (await queries.findByText(document, "Timezone")).click();
  const searchInput = await queries.findByPlaceholderText(document, "Search");
  await searchInput.type("5:30");
  await (
    await queries.findByText(
      document,
      "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"
    )
  ).click();

  await (await queries.findByText(document, "Onset")).click();
  await (await queries.findByText(document, "tomorrow, start")).click();

  await (await queries.findByText(document, "Expires")).click();
  await (await queries.findByText(document, "tomorrow, end")).click();

  await (await queries.findByText(document, "Add URL?")).click();
  await page.keyboard.press("Tab");
  await page.keyboard.type("Resource Description");
  await page.keyboard.press("Tab");
  await page.keyboard.type("https://example.com");
  await page.keyboard.press("Tab");
  await (await queries.findByText(document, "Save")).click();
  await queries.findByText(
    document,
    "Resource added",
    { exact: false },
    { timeout: 2000 }
  );

  await (await queries.findByText(document, "England")).click();
}

export async function assertEditingPage(document: ElementHandle<Element>) {
  await queries.findByText(document, "CAP Alert Composer");
  await queries.findByText(document, "Cancel");
  await queries.findByText(document, /Save|Update draft/);

  await queries.findByText(document, "Headline");
  await queries.findByText(document, "Event");
  await queries.findByText(document, "Description");
  await queries.findByText(document, "Instruction");
  await queries.findByText(document, "Auto-fill from WhatNow?");

  await queries.findByText(document, "Status");
  await queries.findByText(document, "Type");
  await queries.findByText(document, "Category");
  await queries.findByText(document, "Response");
  await queries.findByText(document, "Severity");
  await queries.findByText(document, "Certainty");
  await queries.findByText(document, "Urgency");
  await queries.findByText(document, "Timezone");
  await queries.findByText(document, "Onset");
  await queries.findByText(document, "Expires");
  await queries.findAllByText(document, "Language");
  await queries.findByText(document, "Web");
  await queries.findByText(document, "Contact");

  await queries.findByText(document, "Resources");
  await queries.findByText(document, "Add URL?");
  await queries.findByText(document, "No resources added yet");

  await queries.findByText(document, "Area Description");
  await queries.findByText(document, "Choose/type area name...");
  await queries.findByText(
    document,
    "Type the description of a custom area, or quick-add",
    { exact: false }
  );

  await queries.findByText(document, "Alert XML Preview");

  const mapCanvas = page.$("canvas");
  expect(mapCanvas).toBeTruthy();
}

export async function assertPrefilledEditingPage(
  document: ElementHandle<Element>
) {
  for (const string of [
    "Actual",
    "Alert",
    "Geophysical (e.g., landslide)",
    "Prepare",
    "English (eng)",
    "Immediate",
    "Extreme",
    "Observed",
  ]) {
    await queries.findByText(document, string, {
      selector: ".rs-picker-toggle-value,.rs-picker-value-item",
    });
  }

  for (const string of [
    "Headline text",
    "Flooding",
    "Description text",
    "Instruction text",
  ]) {
    await queries.findByDisplayValue(document, string);
  }

  await queries.findByText(
    document,
    "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi"
  );
}
