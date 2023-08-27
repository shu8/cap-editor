import { afterEach, beforeEach, jest } from "@jest/globals";
import { Prisma, PrismaClient } from "@prisma/client";
import { spawnSync } from "child_process";
import path from "path";

const DATABASE_URL = `postgresql://postgres:postgres@localhost:5432/test?schema=public`;
process.env.DATABASE_URL = DATABASE_URL;
const prisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

let migrationsRan = false;
const tableNamesCsv = Prisma.dmmf.datamodel.models
  .map((m) => `"public"."${m.dbName || m.name}"`)
  .join(", ");

const prismaBinary = path.join("./", "node_modules", ".bin", "prisma");

// Reset db and browser for each test
beforeEach(async () => {
  await prisma.$connect();

  global.prisma = prisma;
  if (!migrationsRan) {
    spawnSync(prismaBinary, ["migrate", "deploy"], {
      env: { ...process.env, DATABASE_URL },
      stdio: [process.stdin, null, process.stderr],
      encoding: "utf-8",
    });
    migrationsRan = true;
  }

  incognito = await browser.createIncognitoBrowserContext();
  page = await incognito.newPage();
});

afterEach(async () => {
  await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNamesCsv} CASCADE`);
  await prisma.$disconnect();
  await fetch("http://localhost:8025/api/v1/messages", {
    method: "DELETE",
  });

  await incognito.close();
});

jest.setTimeout(15000);
