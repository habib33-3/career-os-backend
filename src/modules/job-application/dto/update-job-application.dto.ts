import { ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
} from "class-validator";

import {
    AppliedVia,
    EmploymentType,
    WorkArrangement,
} from "@/generated/prisma/enums";

export class UpdateJobApplicationDto {
    @ApiPropertyOptional({
        example: "Backend Developer",
        description: "Job title",
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    jobTitle?: string;

    @ApiPropertyOptional({
        example: "Build and maintain scalable backend services.",
        description: "Job description",
    })
    @IsOptional()
    @IsString()
    jobDescription?: string;

    @ApiPropertyOptional({
        enum: AppliedVia,
        example: AppliedVia.LINKEDIN,
    })
    @IsOptional()
    @IsEnum(AppliedVia)
    appliedVia?: AppliedVia;

    @ApiPropertyOptional({
        example: "2026-09-15T23:59:59.000Z",
    })
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    applicationDeadline?: Date;

    @ApiPropertyOptional({
        example: "Follow up after one week.",
        description: "Personal note about the application",
    })
    @IsOptional()
    @IsString()
    @MaxLength(2000)
    note?: string;

    @ApiPropertyOptional({
        example: "https://example.com/jobs/backend-developer",
        description: "Job posting URL",
    })
    @IsOptional()
    @IsUrl()
    jobUrl?: string;

    @ApiPropertyOptional({
        example: "Dhaka, Bangladesh",
        description: "Job location",
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    location?: string;

    @ApiPropertyOptional({
        enum: WorkArrangement,
        example: WorkArrangement.REMOTE,
    })
    @IsOptional()
    @IsEnum(WorkArrangement)
    workArrangement?: WorkArrangement;

    @ApiPropertyOptional({
        enum: EmploymentType,
        example: EmploymentType.FULL_TIME,
    })
    @IsOptional()
    @IsEnum(EmploymentType)
    employmentType?: EmploymentType;

    @ApiPropertyOptional({
        example: "80000",
        description: "Salary offered by the employer",
    })
    @IsOptional()
    @IsString()
    offeredSalary?: string;

    @ApiPropertyOptional({
        example: "60000",
        description: "Expected salary",
    })
    @IsOptional()
    @IsString()
    expectedSalary?: string;

    @ApiPropertyOptional({
        example: "BDT",
        description: "Currency used for salary fields",
    })
    @IsOptional()
    @IsString()
    @MaxLength(10)
    salaryCurrency?: string;
}
