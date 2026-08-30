import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import {
    IsDateString,
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from "class-validator";

import { SubmissionType } from "@/generated/prisma/enums";

export class UpdateJobApplicationToTaskReceivedDto {
    @ApiProperty({
        description: "Title of the task",
        example: "Build authentication API",
    })
    @IsString()
    @IsNotEmpty()
    taskTitle: string;

    @ApiPropertyOptional({
        description: "Description of the task",
        example: "Implement JWT authentication with access and refresh tokens.",
    })
    @IsOptional()
    @IsString()
    taskDescription?: string;

    @ApiPropertyOptional({
        description: "Additional note about the task",
        example: "The task requires authentication and role-based access.",
    })
    @IsOptional()
    @IsString()
    taskNote?: string;

    @ApiPropertyOptional({
        description: "Additional note about the task timeline or deadline",
        example: "The deadline was extended by one day.",
    })
    @IsOptional()
    @IsString()
    timelineNote?: string;

    @ApiProperty({
        description:
            "Task requirements. Can be plain text or a document/reference URL.",
        example: "https://docs.google.com/document/d/abc123",
    })
    @IsString()
    @IsNotEmpty()
    requirements: string;

    @ApiProperty({
        description: "Date and time when the task was received",
        example: "2026-08-30T15:00:00.000Z",
        format: "date-time",
    })
    @IsDateString()
    receivedAt: Date;

    @ApiProperty({
        description: "Task submission deadline",
        example: "2026-09-02T15:00:00.000Z",
        format: "date-time",
    })
    @IsDateString()
    deadline: Date;

    @ApiProperty({
        enum: SubmissionType,
        enumName: "SubmissionType",
        description: "Method used to submit the task",
        example: SubmissionType.URL,
    })
    @IsEnum(SubmissionType)
    submissionType: SubmissionType;

    @ApiProperty({
        description:
            "Submission destination or reference. For example, a submission URL or email address.",
        example: "https://github.com/user/task-submission",
    })
    @IsString()
    @IsNotEmpty()
    submissionReference: string;
}
