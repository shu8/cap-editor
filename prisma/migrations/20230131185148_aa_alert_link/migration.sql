/*
  Warnings:

  - Added the required column `alertingAuthorityId` to the `alerts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "alertingAuthorityId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_alertingAuthorityId_fkey" FOREIGN KEY ("alertingAuthorityId") REFERENCES "alerting_authorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
