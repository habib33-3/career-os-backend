import { ApiProperty } from "@nestjs/swagger";

import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MaxLength,
    MinLength,
} from "class-validator";

import { TrimValue } from "@/common/decorators/validators.decorator";

export class RegisterDto {
    @ApiProperty({
        example: "John Doe",
        description: "Full name of the user",
        minLength: 2,
        maxLength: 50,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @TrimValue()
    name: string;

    @ApiProperty({
        example: "user@e.com",
        description: "Valid email address",
    })
    @IsEmail()
    @IsNotEmpty()
    @TrimValue()
    email: string;

    @ApiProperty({
        example: "12345678",
        description: "Password must contain at least 8 characters,",
        minLength: 8,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(100)
    password: string;
}
