/*
  Warnings:

  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_fkey";

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';

-- DropTable
DROP TABLE "sessions";
