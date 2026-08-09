import { ApiPropertyOptional } from "@nestjs/swagger";

import { IsOptional, IsString, IsUrl, MaxLength } from "class-validator";

export class UpdateSourceDto {
    @ApiPropertyOptional({
        example: "LinkedIn",
        description: "Source name",
    })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;

    @ApiPropertyOptional({
        example: "https://www.linkedin.com/jobs",
        description: "Source website URL",
    })
    @IsOptional()
    @IsUrl()
    url?: string;

    @ApiPropertyOptional({
        example: "Primary platform for software engineering jobs.",
        description: "Source description",
    })
    @IsOptional()
    @IsString()
    @MaxLength(1000)
    description?: string;

    @IsOptional()
    @ApiPropertyOptional({
        type: "string",
        format: "binary",
        description: "Optional logo image file for the source (e.g., PNG, JPG)",
    })
    file?: Express.Multer.File;
}
