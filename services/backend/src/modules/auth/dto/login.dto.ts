import { ApiProperty } from "@nestjs/swagger";

import { IsEmail, IsString } from "class-validator";

import { TrimValue } from "@/common/decorators/validators.decorator";

export class LoginDto {
    @ApiProperty({
        example: "user@example.com",
        description: "User email address",
    })
    @TrimValue()
    @IsEmail({}, { message: "Invalid email format" })
    email: string;

    @ApiProperty({
        example: "123456",
        description: "User password",
    })
    @IsString({ message: "Password must be a string" })
    password: string;
}
