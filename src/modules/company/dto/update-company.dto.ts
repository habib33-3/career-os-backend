import { ApiPropertyOptional } from "@nestjs/swagger";

import { Type } from "class-transformer";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    ValidateNested,
} from "class-validator";

export class UpdateCompanyContactDto {
    @ApiPropertyOptional({
        example: "contact@example.invalid",
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        example: "+00000000000",
    })
    @IsOptional()
    @IsString()
    @Length(7, 20)
    phone?: string;

    @ApiPropertyOptional({
        example: "https://linkedin.example.invalid/company/acme",
    })
    @IsOptional()
    @IsUrl()
    linkedin?: string;

    @ApiPropertyOptional({
        example: "https://twitter.example.invalid/acme",
    })
    @IsOptional()
    @IsUrl()
    twitter?: string;

    @ApiPropertyOptional({
        example: "https://facebook.example.invalid/acme",
    })
    @IsOptional()
    @IsUrl()
    facebook?: string;

    @ApiPropertyOptional({
        example: "https://example.invalid/careers",
    })
    @IsOptional()
    @IsUrl()
    careerPage?: string;
}

export class UpdateCompanyDto {
    @ApiPropertyOptional({
        example: "Exampleland",
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    country?: string;

    @ApiPropertyOptional({
        example: "Example City",
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    city?: string;

    @ApiPropertyOptional({
        example: "123 Example Street",
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    address?: string;

    @ApiPropertyOptional({
        example: "Acme Example Corp",
    })
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    name?: string;

    @ApiPropertyOptional({
        example: "A fictional company created for demonstration purposes.",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({
        example: "https://example.invalid",
    })
    @IsOptional()
    @IsUrl()
    url?: string;

    @ApiPropertyOptional({
        type: () => UpdateCompanyContactDto,
    })
    @IsOptional()
    @ValidateNested()
    @Type(() => UpdateCompanyContactDto)
    companyContact?: UpdateCompanyContactDto;
}
