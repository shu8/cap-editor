-- AlterTable
ALTER TABLE "alerting_authorities" ALTER COLUMN "countryCode" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
