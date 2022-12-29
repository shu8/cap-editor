/*
  Warnings:

  - Made the column `userId` on table `alerts` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_userId_fkey";

-- AlterTable
ALTER TABLE "alerts" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
