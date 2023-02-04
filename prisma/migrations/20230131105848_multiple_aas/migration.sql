/*
  Warnings:

  - You are about to drop the column `alertingAuthorityId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `alertingAuthorityVerificationToken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `alertingAuthorityVerified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `roles` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_alertingAuthorityId_fkey";

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "alertingAuthorityId",
DROP COLUMN "alertingAuthorityVerificationToken",
DROP COLUMN "alertingAuthorityVerified",
DROP COLUMN "roles";

-- CreateTable
CREATE TABLE "UserAlertingAuthorities" (
    "userId" TEXT NOT NULL,
    "alertingAuthorityId" TEXT NOT NULL,
    "alertingAuthorityVerificationToken" TEXT NOT NULL,
    "alertingAuthorityVerified" TIMESTAMP(3),
    "roles" "Role"[],

    CONSTRAINT "UserAlertingAuthorities_pkey" PRIMARY KEY ("userId","alertingAuthorityId")
);

-- AddForeignKey
ALTER TABLE "UserAlertingAuthorities" ADD CONSTRAINT "UserAlertingAuthorities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAlertingAuthorities" ADD CONSTRAINT "UserAlertingAuthorities_alertingAuthorityId_fkey" FOREIGN KEY ("alertingAuthorityId") REFERENCES "alerting_authorities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
