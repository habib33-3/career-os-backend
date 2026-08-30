import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsDateString, IsEnum, IsOptional, IsString } from "class-validator";

import { AppliedVia } from "@/generated/prisma/enums";

export class UpdateJobApplicationToAppliedDto {
    @ApiProperty({
        enum: AppliedVia,
        example: AppliedVia.LINKEDIN,
        description: "The platform or method used to submit the application.",
    })
    @IsEnum(AppliedVia)
    appliedVia: AppliedVia;

    @ApiPropertyOptional({
        example: "2026-08-30T14:30:00.000Z",
        description:
            "The date and time when the application was submitted. Defaults to the current time if omitted.",
    })
    @IsOptional()
    @IsDateString()
    appliedAt?: string;

    @ApiPropertyOptional({
        example: "Applied through the company's LinkedIn job posting.",
    })
    @IsOptional()
    @IsString()
    note?: string;
}
