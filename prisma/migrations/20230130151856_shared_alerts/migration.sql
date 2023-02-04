-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "alertingAuthorityId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "shared_alerts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL DEFAULT NOW() + interval '24 hours',

    CONSTRAINT "shared_alerts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shared_alerts" ADD CONSTRAINT "shared_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shared_alerts" ADD CONSTRAINT "shared_alerts_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "alerts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
