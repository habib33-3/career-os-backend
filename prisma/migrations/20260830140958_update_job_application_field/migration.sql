-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SalaryPeriod" ADD VALUE 'DAILY';
ALTER TYPE "SalaryPeriod" ADD VALUE 'WEEKLY';

-- AlterTable
ALTER TABLE "JobApplication" ADD COLUMN     "salaryPeriod" "SalaryPeriod" NOT NULL DEFAULT 'MONTHLY',
ADD COLUMN     "workEndTime" TEXT,
ADD COLUMN     "workStartTime" TEXT;
