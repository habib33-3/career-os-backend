import { Module } from "@nestjs/common";

import { CompanyModule } from "../company/company.module";
import { SourceModule } from "../source/source.module";
import { JobApplicationController } from "./job-application.controller";
import { JobApplicationService } from "./job-application.service";

@Module({
    imports: [CompanyModule, SourceModule],
    controllers: [JobApplicationController],
    providers: [JobApplicationService],
})
export class JobApplicationModule {}
