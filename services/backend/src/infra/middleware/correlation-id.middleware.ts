// src/infra/middleware/correlation-id.middleware.ts
import { NextFunction, Request, Response } from "express";

import { v4 as uuidv4 } from "uuid";

/**
 * Factory middleware to add correlationId to every request.
 * Can be used directly in app.use().
 */
export function createCorrelationIdMiddleware() {
    return (req: Request, _res: Response, next: NextFunction) => {
        req.correlationId =
            (req.headers["x-correlation-id"] as string) || uuidv4();
        next();
    };
}
