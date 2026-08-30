import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "@/infra/db/prisma/prisma.service";

import { UpdateJobApplicationToAppliedDto } from "./dto/update-to-apply.dto";
import { UpdateJobApplicationToTaskReceivedDto } from "./dto/update-to-task-received.dto";
import { JobApplicationService } from "./job-application.service";

@Injectable()
export class UpdateJobApplicationStatusService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jobApplicationService: JobApplicationService
    ) {}

    async updateStatusToApplied(
        id: string,
        userId: string,
        payload: UpdateJobApplicationToAppliedDto
    ) {
        const jobApplication =
            await this.jobApplicationService.getJobApplicationById(id, userId);

        if (jobApplication.status !== "NOT_APPLIED") {
            throw new BadRequestException(
                "Job application already submitted or ongoing"
            );
        }

        const appliedAt = payload.appliedAt
            ? new Date(payload.appliedAt)
            : new Date();

        await this.prisma.$transaction(async (tx) => {
            await tx.jobApplication.update({
                where: { id },
                data: {
                    appliedVia: payload.appliedVia,
                    appliedAt,
                    status: "APPLIED",
                },
            });

            await tx.jobApplicationEvent.create({
                data: {
                    jobApplicationId: id,
                    type: "APPLICATION_SUBMITTED",
                    fromStatus: jobApplication.status,
                    toStatus: "APPLIED",
                    occurredAt: appliedAt,
                    note: payload.note,
                },
            });
        });

        return {
            message: "Job application submitted successfully",
        };
    }

    async updateStatusToTaskReceived(
        id: string,
        userId: string,
        payload: UpdateJobApplicationToTaskReceivedDto
    ) {
        const jobApplication =
            await this.jobApplicationService.getJobApplicationById(id, userId);

        if (jobApplication.status !== "APPLIED") {
            throw new BadRequestException(
                "Job application is not in applied status"
            );
        }

        await this.prisma.$transaction(async (tx) => {
            await tx.jobApplication.update({
                where: { id },
                data: {
                    status: "TASK_RECEIVED",
                },
            });

            await tx.jobApplicationEvent.create({
                data: {
                    jobApplicationId: id,
                    type: "TASK_RECEIVED",
                    fromStatus: jobApplication.status,
                    toStatus: "TASK_RECEIVED",
                    occurredAt: new Date(),
                    note: payload.timelineNote,
                },
            });

            await tx.jobApplicationTask.create({
                data: {
                    jobApplicationId: id,
                    requirements: payload.requirements,
                    title: payload.taskTitle,
                    deadline: payload.deadline,
                    description: payload.taskDescription,
                    note: payload.taskNote,
                    submissionReference: payload.submissionReference,
                    submissionType: payload.submissionType,
                    receivedAt: payload.receivedAt,
                },
            });
        });

        return {
            message: "Task received successfully",
        };
    }
}
