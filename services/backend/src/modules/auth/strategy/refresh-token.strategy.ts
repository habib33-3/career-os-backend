import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { Request } from "express";

import { ExtractJwt, Strategy } from "passport-jwt";

import { env } from "@/common/env/env";

import { REFRESH_TOKEN } from "../constants/auth.constants";
import { extractToken } from "../util/extract-token";

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    REFRESH_TOKEN
) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                extractToken(REFRESH_TOKEN),
            ]),
            secretOrKey: env.REFRESH_TOKEN_SECRET,
            passReqToCallback: true,
            algorithms: ["HS256"],
            ignoreExpiration: false,
        });
    }

    async validate(req: Request, payload: { sub: string; type: string }) {
        if (payload.type !== "refresh") {
            throw new UnauthorizedException("Invalid token type");
        }

        // eslint-disable-next-line security/detect-object-injection
        const refreshToken = req?.cookies?.[REFRESH_TOKEN];

        if (!refreshToken) {
            throw new UnauthorizedException("Refresh token missing");
        }

        return {
            userId: payload.sub,
            refreshToken,
        };
    }
}
