import { PrismaClient, Prisma } from "@prisma/client";
import { jest, beforeEach, afterEach } from "@jest/globals";
import { randomUUID } from "crypto";
import { spawnSync } from "child_process";
import path from "path";
import redisMock from "redis-mock";
import { promisify } from "util";

/**
 * Tests with Prisma inspired by https://github.com/selimb/fast-prisma-tests
 */

// New Schema per test file
const DATABASE_SCHEMA_NAME = "a" + randomUUID().split("-")[0];
const DATABASE_URL = `postgresql://postgres:postgres@localhost:5432/test?schema=${DATABASE_SCHEMA_NAME}`;

const mockPrisma = new PrismaClient({
  datasources: { db: { url: DATABASE_URL } },
});

let migrationsRan = false;
const tableNamesCsv = Prisma.dmmf.datamodel.models
  .map((m) => `"${DATABASE_SCHEMA_NAME}"."${m.dbName}"`)
  .join(", ");

const prismaBinary = path.join("./", "node_modules", ".bin", "prisma");

// Reset db for each test
beforeEach(async () => {
  await mockPrisma.$connect();

  if (!migrationsRan) {
    spawnSync(prismaBinary, ["migrate", "deploy"], {
      env: { ...process.env, DATABASE_URL },
      stdio: [process.stdin, null, process.stderr],
      encoding: "utf-8",
    });
    migrationsRan = true;
  }
});

afterEach(async () => {
  await mockPrisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNamesCsv} CASCADE`);
  await mockPrisma.$disconnect();
});

jest.mock("../../lib/prisma", () => ({
  __esModule: true,
  default: mockPrisma,
}));

const mockRedis = redisMock.createClient();
mockRedis.set = promisify(mockRedis.set.bind(mockRedis));
jest.mock("../../lib/redis", () => ({
  __esModule: true,
  default: mockRedis,
}));

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockReturnValue((mailoptions, callback) => {}),
  }),
}));

jest.mock("../../lib/helpers", () => {
  const originalHelpers = jest.requireActual("../../lib/helpers") as any;

  return {
    __esModule: true,
    ...originalHelpers,
    fetchWMOAlertingAuthorities: jest.fn(() => [
      {
        name: "Test AA",
        id: "aa",
        author: "aa@example.com",
        countryCode: "GB",
        polygon: "59.7,-8 49.9,-8 49.9,2 59.7,2 59.7,-8",
      },
    ]),
  };
});

export const prismaMock = mockPrisma;
