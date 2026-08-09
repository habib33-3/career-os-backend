import { Request } from "express";

export const extractToken = (cookieKey: string) => {
    return (req: Request): string | null => {
        const authHeader = req?.headers?.authorization;

        // 1. Bearer token (priority)
        if (authHeader?.startsWith("Bearer ")) {
            return authHeader.slice(7);
        }

        // 2. Cookie fallback
        // eslint-disable-next-line security/detect-object-injection
        const cookieToken = req?.cookies?.[cookieKey];
        if (cookieToken) return cookieToken;

        return null;
    };
};
