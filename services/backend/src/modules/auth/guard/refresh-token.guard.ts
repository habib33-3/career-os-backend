import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { REFRESH_TOKEN } from "../constants/auth.constants";

@Injectable()
export class RefreshTokenAuthGuard extends AuthGuard(REFRESH_TOKEN) {
    handleRequest<TUser>(
        err: Error | null,
        user: TUser | false,
        info: Error | string | null
    ): TUser {
        if (err) throw new UnauthorizedException(err.message);
        if (!user) {
            const message =
                info instanceof Error
                    ? info.message
                    : (info ?? "Refresh token invalid or missing");
            throw new UnauthorizedException(message);
        }

        return user;
    }
}
