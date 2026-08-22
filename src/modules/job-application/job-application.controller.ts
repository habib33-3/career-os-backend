import {
    Body,
    Controller,
    DefaultValuePipe,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseEnumPipe,
    ParseIntPipe,
    Post,
    Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";

import {
    AppliedVia,
    EmploymentType,
    JobApplicationStatus,
    WorkArrangement,
} from "@/generated/prisma/enums";

import { AddJobApplicationDto } from "./dto/add-job-application.dto";
import { JobApplicationService } from "./job-application.service";

@Controller("job-application")
export class JobApplicationController {
    constructor(
        private readonly jobApplicationService: JobApplicationService
    ) {}

    @HttpCode(HttpStatus.CREATED)
    @Post()
    @ApiOperation({
        summary: "Add job application",
        description: "Add job application",
    })
    async addJobApplication(
        @CurrentUser("sub") userId: string,
        @Body() payload: AddJobApplicationDto
    ) {
        return this.jobApplicationService.addJobApplication(userId, payload);
    }

    @Get()
    @ApiOperation({
        summary: "Get job applications",
        description:
            "Get the authenticated user's job applications with cursor-based pagination, search, and filters.",
    })
    @ApiQuery({
        name: "limit",
        required: false,
        type: Number,
        example: 10,
        description: "Number of applications to return. Maximum 50.",
    })
    @ApiQuery({
        name: "cursorId",
        required: false,
        type: String,
        example: "cm123abc456",
        description: "Cursor ID from the previous response.",
    })
    @ApiQuery({
        name: "search",
        required: false,
        type: String,
        example: "backend developer",
    })
    @ApiQuery({
        name: "status",
        required: false,
        enum: JobApplicationStatus,
    })
    @ApiQuery({
        name: "workArrangement",
        required: false,
        enum: WorkArrangement,
    })
    @ApiQuery({
        name: "employmentType",
        required: false,
        enum: EmploymentType,
    })
    @ApiQuery({
        name: "appliedVia",
        required: false,
        enum: AppliedVia,
    })
    async getJobApplications(
        @CurrentUser("sub") userId: string,

        @Query("limit", new DefaultValuePipe(10), ParseIntPipe)
        limit: number,

        @Query("cursorId")
        cursorId?: string,

        @Query("search")
        search?: string,

        @Query(
            "status",
            new ParseEnumPipe(JobApplicationStatus, {
                optional: true,
            })
        )
        status?: JobApplicationStatus,

        @Query(
            "workArrangement",
            new ParseEnumPipe(WorkArrangement, {
                optional: true,
            })
        )
        workArrangement?: WorkArrangement,

        @Query(
            "employmentType",
            new ParseEnumPipe(EmploymentType, {
                optional: true,
            })
        )
        employmentType?: EmploymentType,

        @Query(
            "appliedVia",
            new ParseEnumPipe(AppliedVia, {
                optional: true,
            })
        )
        appliedVia?: AppliedVia
    ) {
        const filter = {
            ...(status && { status }),
            ...(workArrangement && { workArrangement }),
            ...(employmentType && { employmentType }),
            ...(appliedVia && { appliedVia }),
        };

        return this.jobApplicationService.getJobApplications(
            userId,
            limit,
            cursorId,
            search,
            Object.keys(filter).length > 0 ? filter : undefined
        );
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get job application details",
        description: "Get job application details",
    })
    async getJobApplicationDetails(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string
    ) {
        return this.jobApplicationService.getJobApplicationById(id, userId);
    }
}
