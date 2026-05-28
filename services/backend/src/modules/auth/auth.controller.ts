import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import type { Response } from "express";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";
import { Public } from "@/common/decorators/auth/public.decorator";
import { env } from "@/common/env/env";

import { AuthService } from "./auth.service";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants/auth.constants";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { RefreshTokenAuthGuard } from "./guard/refresh-token.guard";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    private setAuthCookies(
        res: Response,
        tokens: { accessToken: string; refreshToken: string }
    ) {
        const isProd = env.NODE_ENV === "production";

        const cookieOptions = {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            path: "/",
        } as const;

        res.cookie(ACCESS_TOKEN, tokens.accessToken, {
            ...cookieOptions,
            maxAge: env.ACCESS_TOKEN_EXPIRES,
        });

        res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
            ...cookieOptions,
            maxAge: env.REFRESH_TOKEN_EXPIRES,
        });
    }

    @Public()
    @Post("register")
    @ApiOperation({ summary: "Register a new user", security: [] })
    async register(
        @Body() payload: RegisterDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.register(payload);

        this.setAuthCookies(res, result.token);

        return {
            message: result.message,
            data: result.user,
        };
    }

    @Public()
    @Post("login")
    @ApiOperation({ summary: "Login a user", security: [] })
    async login(
        @Body() payload: LoginDto,
        @Res({ passthrough: true }) res: Response
    ) {
        const result = await this.authService.login(payload);

        this.setAuthCookies(res, result.token);

        return {
            message: result.message,
            data: result.user,
        };
    }

    @Get("me")
    @ApiOperation({ summary: "Get current user info" })
    async getCurrentUser(@CurrentUser("sub") userId: string) {
        const user = await this.authService.getCurrentUser(userId);
        return {
            data: user,
        };
    }

    @Post("logout")
    @ApiOperation({ summary: "Logout a user" })
    async logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie(ACCESS_TOKEN, { path: "/" });
        res.clearCookie(REFRESH_TOKEN, { path: "/" });

        return {
            message: "Logout successful",
        };
    }

    @UseGuards(RefreshTokenAuthGuard)
    @Post("refresh")
    async refresh(
        @Req()
        req: Request & {
            user: {
                sub: string;
                refreshToken: string;
            };
        }
    ) {
        const tokens = await this.authService.refreshToken(
            req.user.sub,
            req.user.refreshToken
        );

        return {
            data: tokens,
        };
    }
}
