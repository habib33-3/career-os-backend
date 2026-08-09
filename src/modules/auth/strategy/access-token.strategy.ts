import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";

import { ExtractJwt, Strategy } from "passport-jwt";

import { JwtPayload } from "@/types/types";

import { env } from "@/common/env/env";

import { AuthService } from "../auth.service";
import { ACCESS_TOKEN } from "../constants/auth.constants";
import { extractToken } from "../util/extract-token";

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
    Strategy,
    ACCESS_TOKEN
) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                extractToken(ACCESS_TOKEN),
            ]),
            secretOrKey: env.ACCESS_TOKEN_SECRET,
            algorithms: ["HS256"],
            ignoreExpiration: false,
        });
    }

    async validate(payload: JwtPayload) {
        if (payload.type !== "access") {
            throw new UnauthorizedException("Invalid token type");
        }

        // DB check lives here — validate() is async, no type conflict
        const user = await this.authService.validateUser(payload.email);

        if (user.role !== payload.role) {
            throw new UnauthorizedException("User role mismatch");
        }

        // Whatever you return here lands on req.user
        return {
            sub: payload.sub,
            email: payload.email,
            role: payload.role,
        };
    }
}
