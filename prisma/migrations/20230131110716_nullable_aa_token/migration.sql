-- AlterTable
ALTER TABLE "UserAlertingAuthorities" ALTER COLUMN "alertingAuthorityVerificationToken" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
