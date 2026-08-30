-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'COMPLETED', 'SKIPPED');

-- CreateEnum
CREATE TYPE "SubmissionType" AS ENUM ('URL', 'EMAIL');

-- CreateTable
CREATE TABLE "JobApplicationTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "requirements" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3),
    "deadline" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3),
    "submissionType" "SubmissionType",
    "submissionReference" TEXT,
    "jobApplicationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplicationTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "JobApplicationTask_jobApplicationId_idx" ON "JobApplicationTask"("jobApplicationId");

-- AddForeignKey
ALTER TABLE "JobApplicationTask" ADD CONSTRAINT "JobApplicationTask_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;
