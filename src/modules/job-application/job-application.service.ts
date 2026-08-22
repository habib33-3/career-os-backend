import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { Decimal } from "@prisma/client/runtime/client";

import { PrismaService } from "@/infra/db/prisma/prisma.service";

import { Prisma } from "@/generated/prisma/client";
import {
    AppliedVia,
    EmploymentType,
    JobApplicationStatus,
    WorkArrangement,
} from "@/generated/prisma/enums";

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

    async getJobApplications(
        userId: string,
        limit = 10,
        cursorId?: string,
        search?: string,
        filter?: {
            status?: JobApplicationStatus;
            workArrangement?: WorkArrangement;
            employmentType?: EmploymentType;
            appliedVia?: AppliedVia;
        }
    ) {
        limit = Math.min(Math.max(limit, 1), 50);

        const where: Prisma.JobApplicationWhereInput = {
            userId,
        };

        if (search?.trim()) {
            const searchTerm = search.trim();

            where.OR = [
                { jobTitle: { contains: searchTerm, mode: "insensitive" } },
                {
                    jobDescription: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                },
                { jobUrl: { contains: searchTerm, mode: "insensitive" } },
                { location: { contains: searchTerm, mode: "insensitive" } },
                { note: { contains: searchTerm, mode: "insensitive" } },
                {
                    source: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
                {
                    company: {
                        name: {
                            contains: searchTerm,
                            mode: "insensitive",
                        },
                    },
                },
            ];
        }

        if (filter?.status) {
            where.status = filter.status;
        }

        if (filter?.workArrangement) {
            where.workArrangement = filter.workArrangement;
        }

        if (filter?.employmentType) {
            where.employmentType = filter.employmentType;
        }

        if (filter?.appliedVia) {
            where.appliedVia = filter.appliedVia;
        }

        const applications = await this.prisma.jobApplication.findMany({
            where,
            orderBy: [{ createdAt: "desc" }, { id: "desc" }],
            take: limit + 1,
            ...(cursorId && {
                cursor: { id: cursorId },
                skip: 1,
            }),
            select: {
                id: true,
                jobTitle: true,
                status: true,
                applicationDeadline: true,
                employmentType: true,
                workArrangement: true,
                appliedVia: true,
                expectedSalary: true,
                offeredSalary: true,
                createdAt: true,
            },
        });

        const hasNextPage = applications.length > limit;

        const data = hasNextPage ? applications.slice(0, limit) : applications;

        return {
            data,
            meta: {
                hasNextPage,
                nextCursor: hasNextPage ? data[data.length - 1].id : null,
            },
        };
    }

    async getJobApplicationById(id: string, userId: string) {
        const application = await this.prisma.jobApplication.findFirstOrThrow({
            where: { id, userId },
            include: {
                source: true,
                company: true,
                jobApplicationEvents: true,
            },
        });

        if (!application)
            throw new NotFoundException("Job Application not found");

        return application;
    }
}
