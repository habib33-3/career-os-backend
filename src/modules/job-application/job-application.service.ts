import { BadRequestException, Injectable } from "@nestjs/common";

import { Decimal } from "@prisma/client/runtime/client";

import { PrismaService } from "@/infra/db/prisma/prisma.service";

import { CompanyService } from "../company/company.service";
import { SourceService } from "../source/source.service";
import { AddJobApplicationDto } from "./dto/add-job-application.dto";

@Injectable()
export class JobApplicationService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly companyService: CompanyService,
        private readonly sourceService: SourceService
    ) {}

    private validateApplicationDeadline(deadline?: Date) {
        if (!deadline) return;

        if (deadline.getTime() < Date.now()) {
            throw new BadRequestException("Application deadline has passed");
        }
    }

    private convertToDecimal(value?: string): Decimal | undefined {
        if (value === undefined) return;

        return new Decimal(value);
    }

    async addJobApplication(userId: string, payload: AddJobApplicationDto) {
        this.validateApplicationDeadline(payload.applicationDeadline);

        await this.companyService.getCompanyById(userId, payload.companyId);

        await this.sourceService.getSourceById(payload.sourceId, userId);

        const isApplied = payload.appliedVia !== undefined;

        return this.prisma.$transaction(async (tx) => {
            const jobApplication = await tx.jobApplication.create({
                data: {
                    userId,
                    sourceId: payload.sourceId,
                    companyId: payload.companyId,

                    jobTitle: payload.jobTitle,
                    jobDescription: payload.jobDescription,
                    jobUrl: payload.jobUrl,
                    location: payload.location,

                    applicationDeadline: payload.applicationDeadline,

                    employmentType: payload.employmentType,
                    workArrangement: payload.workArrangement,

                    appliedVia: payload.appliedVia,
                    status: isApplied ? "APPLIED" : "NOT_APPLIED",

                    expectedSalary: this.convertToDecimal(
                        payload.expectedSalary
                    ),
                    offeredSalary: this.convertToDecimal(payload.offeredSalary),
                    salaryCurrency: payload.salaryCurrency,

                    note: payload.note,
                },
            });

            if (isApplied) {
                await tx.jobApplicationEvent.create({
                    data: {
                        jobApplicationId: jobApplication.id,
                        occurredAt: new Date(),
                        type: "APPLICATION_SUBMITTED",
                        fromStatus: "NOT_APPLIED",
                        toStatus: "APPLIED",
                    },
                });
            }

            return jobApplication;
        });
    }
}
