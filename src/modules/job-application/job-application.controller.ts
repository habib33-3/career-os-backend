import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";

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
}
