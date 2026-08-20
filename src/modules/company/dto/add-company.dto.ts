import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";

export class AddCompanyDto {
    @ApiProperty({
        example: "Acme Corporation",
        description: "Company name",
        maxLength: 100,
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    name: string;

    @ApiProperty({
        example: "Bangladesh",
        description: "Country where the company is located",
    })
    @IsString()
    @IsNotEmpty()
    @MaxLength(100)
    country: string;

    @ApiPropertyOptional({
        example: "123 Main Street, Dhaka",
        description: "Company address",
        maxLength: 255,
    })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;
}
