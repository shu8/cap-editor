-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('PUBLISHED', 'TEMPLATE', 'DRAFT');

-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "status" "AlertStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
