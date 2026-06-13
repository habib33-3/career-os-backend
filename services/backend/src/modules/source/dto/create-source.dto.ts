import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import {
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
} from "class-validator";

export class CreateSourceDto {
    @ApiProperty({
        example: "My Tech Blog",
        description: "Name of the source",
        minLength: 2,
        maxLength: 100,
    })
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: "https://example.com",
        description: "Valid URL of the source",
    })
    @IsString()
    @IsUrl({}, { message: "url must be a valid URL" })
    url: string;

    @ApiPropertyOptional({
        example: "A blog about backend engineering and system design",
        description: "Optional description of the source",
        maxLength: 500,
    })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    description?: string;
}
