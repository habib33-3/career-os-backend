import {
    createParamDecorator,
    ExecutionContext,
    UnauthorizedException,
} from "@nestjs/common";

import { Request } from "express";

import { JwtPayload } from "@/types/types";

export const CurrentUser = createParamDecorator(
    (key: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<Request>();

        const user = request.user as JwtPayload | undefined;

        if (!user) {
            throw new UnauthorizedException(
                "User not found in request context"
            );
        }

        return key ? user[key] : user;
    }
);
