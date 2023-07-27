-- AlterTable
ALTER TABLE "alerting_authorities" ADD COLUMN     "contact" TEXT,
ADD COLUMN     "defaultTimezone" TEXT NOT NULL DEFAULT 'Etc/GMT',
ADD COLUMN     "web" TEXT;

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
