import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
    IsDate,
    IsDecimal,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    MaxLength,
    MinLength,
    ValidateIf,
} from "class-validator";

import {
    AppliedVia,
    EmploymentType,
    WorkArrangement,
} from "@/generated/prisma/enums";

export class AddJobApplicationDto {
    @ApiProperty({
        description: "Job title or position name.",
        example: "Backend Developer",
        minLength: 2,
        maxLength: 200,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(200)
    jobTitle: string;

    @ApiPropertyOptional({
        description: "Full job description.",
        example:
            "We are looking for a Backend Developer with experience in NestJS, PostgreSQL, and Redis.",
        maxLength: 10000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(10000)
    jobDescription?: string;

    @ApiProperty({
        description: "ID of the job source.",
        example: "cm123abc456def789",
    })
    @IsString()
    @IsNotEmpty()
    sourceId: string;

    @ApiProperty({
        description: "ID of the company offering the job.",
        example: "cm987xyz654abc321",
    })
    @IsString()
    @IsNotEmpty()
    companyId: string;

    @ApiPropertyOptional({
        description: "URL of the job posting.",
        example: "https://www.linkedin.com/jobs/view/123456789",
    })
    @IsUrl()
    @IsOptional()
    jobUrl: string;

    @ApiPropertyOptional({
        description: "Job location.",
        example: "Dhaka, Bangladesh",
        maxLength: 200,
    })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    location?: string;

    @ApiProperty({
        description: "Work arrangement for the position.",
        enum: WorkArrangement,
        example: WorkArrangement.HYBRID,
    })
    @IsEnum(WorkArrangement)
    workArrangement: WorkArrangement;

    @ApiPropertyOptional({
        description: "Application deadline.",
        example: "2026-09-15T23:59:59.000Z",
        type: String,
        format: "date-time",
    })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    applicationDeadline?: Date;

    @ApiPropertyOptional({
        description: "Type of employment.",
        enum: EmploymentType,
        example: EmploymentType.FULL_TIME,
    })
    @IsOptional()
    @IsEnum(EmploymentType)
    employmentType?: EmploymentType;

    @ApiPropertyOptional({
        description: "Salary offered by the company.",
        example: "80000.00",
        type: String,
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: "0,2",
    })
    offeredSalary?: string;

    @ApiPropertyOptional({
        description: "Expected salary.",
        example: "100000.00",
        type: String,
    })
    @IsOptional()
    @IsDecimal({
        decimal_digits: "0,2",
    })
    expectedSalary?: string;

    @ApiPropertyOptional({
        description:
            "Currency used for salary values. Required when offeredSalary or expectedSalary is provided.",
        example: "USD",
        minLength: 3,
        maxLength: 3,
    })
    @ValidateIf(
        (dto: AddJobApplicationDto) =>
            dto.offeredSalary !== undefined || dto.expectedSalary !== undefined
    )
    @IsString()
    @IsNotEmpty()
    @Length(3, 3)
    salaryCurrency?: string;

    @ApiPropertyOptional({
        description:
            "Method used to apply for the job. Required when appliedNow is true.",
        enum: AppliedVia,
        example: AppliedVia.LINKEDIN,
    })
    @IsOptional()
    @IsEnum(AppliedVia)
    appliedVia?: AppliedVia;

    @ApiPropertyOptional({
        description: "Additional notes about the job application.",
        example: "Referred by a former colleague.",
        maxLength: 5000,
    })
    @IsOptional()
    @IsString()
    @MaxLength(5000)
    note?: string;
}
