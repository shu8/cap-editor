/*
  Warnings:

  - The values [TEMPLATE] on the enum `AlertStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- Convert all TEMPLATEs to DRAFTs
UPDATE "alerts" SET "status" = 'DRAFT' WHERE "status" = 'TEMPLATE';

-- AlterEnum
BEGIN;
CREATE TYPE "AlertStatus_new" AS ENUM ('PUBLISHED', 'DRAFT');
ALTER TABLE "alerts" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "alerts" ALTER COLUMN "status" TYPE "AlertStatus_new" USING ("status"::text::"AlertStatus_new");
ALTER TYPE "AlertStatus" RENAME TO "AlertStatus_old";
ALTER TYPE "AlertStatus_new" RENAME TO "AlertStatus";
DROP TYPE "AlertStatus_old";
ALTER TABLE "alerts" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
