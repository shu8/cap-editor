-- AlterTable
ALTER TABLE "alerting_authorities" ADD COLUMN     "severityCertaintyMatrixEnabled" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
