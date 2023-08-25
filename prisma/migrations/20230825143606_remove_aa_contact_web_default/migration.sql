/*
  Warnings:

  - You are about to drop the column `contact` on the `alerting_authorities` table. All the data in the column will be lost.
  - You are about to drop the column `web` on the `alerting_authorities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "alerting_authorities" DROP COLUMN "contact",
DROP COLUMN "web";

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
