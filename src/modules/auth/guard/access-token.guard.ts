import {
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

import { Observable } from "rxjs";

import { JwtPayload } from "@/types/types";

import { IS_PUBLIC_KEY } from "../../../common/decorators/auth/public.decorator";
import { ACCESS_TOKEN } from "../constants/auth.constants";

@Injectable()
export class AccessTokenAuthGuard extends AuthGuard(ACCESS_TOKEN) {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    canActivate(
        context: ExecutionContext
    ): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic) return true;

        return super.canActivate(context); // ✅ Let Passport extract, verify, then call handleRequest
    }

    handleRequest<TUser = JwtPayload>(
        err: Error | null,
        user: TUser | false,
        info: Error | string | null // ✅ Was `_info` — now used for specific error messages
    ): TUser {
        if (err) throw new UnauthorizedException(err.message);
        if (!user) {
            // `info` from passport-jwt: "No auth token", "jwt expired", "invalid signature", etc.
            const message =
                info instanceof Error ? info.message : (info ?? "Unauthorized");
            throw new UnauthorizedException(message);
        }

        return user;
    }
}
