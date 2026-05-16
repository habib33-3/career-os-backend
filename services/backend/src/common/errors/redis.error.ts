import { HttpStatus } from "@nestjs/common";

import type { IAppErrorMapped } from "./exception-mappers";

export function mapRedis(exception: unknown): IAppErrorMapped | null {
    const e = exception as NodeJS.ErrnoException & {
        name?: string;
        message?: string;
        code?: string;
        stack?: string;
    };

    if (!e || typeof e !== "object") return null;

    const message = e.message?.toLowerCase() ?? "";
    const name = e.name?.toLowerCase() ?? "";
    const code = e.code?.toLowerCase() ?? "";

    // Network / Connection
    if (
        code === "econnrefused" ||
        code === "ehostunreach" ||
        code === "etimedout"
    ) {
        return {
            context: "Redis",
            message: "Redis service is unavailable.",
            stack: e.stack,
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        };
    }

    // DNS resolution
    if (code === "enotfound") {
        return {
            context: "Redis",
            message: "Redis host not found.",
            stack: e.stack,
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
        };
    }

    // Timeout / Max retries
    if (message.includes("timeout") || name === "maxretriesperrequesterror") {
        return {
            context: "Redis",
            message: "Redis request timed out.",
            stack: e.stack,
            statusCode: HttpStatus.GATEWAY_TIMEOUT,
        };
    }

    // Auth errors
    if (message.includes("noauth")) {
        return {
            context: "Redis",
            message: "Redis authentication failed.",
            stack: e.stack,
            statusCode: HttpStatus.UNAUTHORIZED,
        };
    }

    // ioredis command errors
    if (name === "replyerror") {
        return {
            context: "Redis",
            message: e.message ?? "Redis command error",
            stack: e.stack,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }

    // Generic Redis error
    if (name.includes("redis")) {
        return {
            context: "Redis",
            message: "Unexpected Redis error occurred.",
            stack: e.stack,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }

    return null;
}
