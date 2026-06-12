import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as argon2 from "argon2";

import { env } from "@/common/env/env";
import { hashPassword, verifyPassword } from "@/common/security/password";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";
import { userCacheKeyWithEmail } from "@/infra/db/redis/cache-key";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { generateAvatar } from "./util/generate-avatar";

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
        const key = userCacheKeyWithEmail(email);

        const cachedUser = await this.cache.get<{
            id: string;
            email: string;
            role: string;
        }>(key);

        if (cachedUser) {
            return cachedUser;
        }

        const user = await this.prisma.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            throw new UnauthorizedException("Wrong credentials ");
        }

        await this.cache.set(key, user);

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

        const avatar = generateAvatar(payload.name);

        const user = await this.prisma.user.create({
            data: {
                email: payload.email,
                name: payload.name,
                password: hashedPassword,
                image: avatar,
            },
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                image: true,
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
            user,
        };
    }

    async login(payload: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: payload.email },
            select: {
                id: true,
                email: true,
                role: true,
                password: true,
                image: true,
            },
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
            user,
        };
    }

    async getCurrentUser(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                image: true,
            },
        });

        if (!user) throw new NotFoundException("User not found");

        return user;
    }

    async refreshToken(userId: string, refreshToken: string) {
        const storedHash = await this.cache.get<string>(`refresh:${userId}`);

        if (!storedHash) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        const isValid = await argon2.verify(storedHash, refreshToken);

        if (!isValid) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        const user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        const accessToken = this.generateToken(
            {
                sub: user.id,
                email: user.email,
                role: user.role,
            },
            "access"
        );

        const newRefreshToken = this.generateToken(
            {
                sub: user.id,
            },
            "refresh"
        );

        const hashed = await argon2.hash(newRefreshToken);

        await this.cache.set(
            `refresh:${user.id}`,
            hashed,
            env.REFRESH_TOKEN_EXPIRES
        );

        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(userId: string) {
        await this.cache.invalidate(`refresh:${userId}`);
    }
}
