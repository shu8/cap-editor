-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'eng';

-- AlterTable
ALTER TABLE "shared_alerts" ALTER COLUMN "expires" SET DEFAULT NOW() + interval '24 hours';
