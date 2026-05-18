import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";

import { env } from "@/common/env/env";
import { hashPassword, verifyPassword } from "@/common/security/password";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly cache: AppCache
    ) {}

    private generateToken(
        payload:
            | { sub: string; email: string; role: string } // access
            | { sub: string }, // refresh
        type: "access" | "refresh"
    ): string {
        const isAccess = type === "access";

        return this.jwt.sign(
            {
                ...payload,
                type,
            },
            {
                secret: isAccess
                    ? env.ACCESS_TOKEN_SECRET
                    : env.REFRESH_TOKEN_SECRET,

                expiresIn: isAccess
                    ? env.ACCESS_TOKEN_EXPIRES
                    : env.REFRESH_TOKEN_EXPIRES,

                algorithm: "HS256",
            }
        );
    }

    async validateUser(email: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        return user;
    }

    async register(payload: RegisterDto) {
        const userExists = await this.prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (userExists) {
            throw new BadRequestException("Unable to process request");
        }

        const hashedPassword = await hashPassword(payload.password);

        const user = await this.prisma.user.create({
            data: {
                email: payload.email,
                name: payload.name,
                password: hashedPassword,
            },
        });

        const accessToken = this.generateToken(
            { sub: user.id, email: user.email, role: user.role },
            "access"
        );

        const refreshToken = this.generateToken({ sub: user.id }, "refresh");

        const hashed = await argon2.hash(refreshToken);

        await this.cache.set(
            `refresh:${user.id}`,
            hashed,
            env.REFRESH_TOKEN_EXPIRES
        );

        return {
            message: "Registration successful",
            token: {
                accessToken,
                refreshToken,
            },
        };
    }

    async login(payload: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: payload.email },
        });

        if (!user) throw new UnauthorizedException("Wrong credentials");

        const isMatch = await verifyPassword(payload.password, user.password);
        if (!isMatch) throw new UnauthorizedException("Wrong credentials");

        const accessToken = this.generateToken(
            { sub: user.id, email: user.email, role: user.role },
            "access"
        );

        const refreshToken = this.generateToken({ sub: user.id }, "refresh");

        // store hashed refresh token
        const hashed = await argon2.hash(refreshToken);

        await this.cache.set(
            `refresh:${user.id}`,
            hashed,
            env.REFRESH_TOKEN_EXPIRES
        );

        return {
            message: "Login successful",
            token: {
                accessToken,
                refreshToken,
            },
        };
    }
}
