import { Request } from "express";

import { format } from "date-fns";
import morgan from "morgan";

import { AppLoggerService } from "../app-logger/app-logger.service";

morgan.token("correlation-id", (req: Request) => req.correlationId ?? "");

export function createMorganMiddleware(logger: AppLoggerService) {
    return morgan(
        (tokens, req, res) => {
            const timestamp = new Date();
            return JSON.stringify({
                contentLength: tokens.res(req, res, "content-length"),
                correlationId: tokens["correlation-id"](req, res),
                formattedTimestamp: format(
                    timestamp,
                    "yyyy-MM-dd HH:mm:ss.SSS"
                ),
                method: tokens.method(req, res),
                responseTime: Number(tokens["response-time"](req, res) ?? 0),
                status: Number(tokens.status(req, res) ?? 0),
                timestamp: timestamp.toISOString(),
                url: tokens.url(req, res),
            });
        },
        {
            stream: {
                write(message: string) {
                    try {
                        const parsed = JSON.parse(message);
                        logger.log(parsed);
                    } catch (err) {
                        logger.error("Failed to parse Morgan log", err);
                    }
                },
            },
        }
    );
}
