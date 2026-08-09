import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";

import { Request, Response } from "express";

import { format } from "date-fns";

import { env } from "@/common/env/env";
import { mapException } from "@/common/errors/exception-mappers";

import { AppLoggerService } from "../app-logger/app-logger.service";

export type ApiErrorResponse = {
    success: false;
    timestamp: string;
    formattedTimestamp?: string;
    path: string;
    statusCode: number;
    message: string;
    correlationId?: string;
    meta?: {
        stack?: string;
        context?: string;
        [key: string]: unknown;
    };
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(private readonly logger: AppLoggerService) {}

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const correlationId = request.correlationId ?? undefined;

        const now = new Date();
        const isoTimestamp = now.toISOString();
        const formattedTimestamp = format(now, "yyyy-MM-dd HH:mm:ss.SSS");

        const appError = mapException(exception);

        // Log with human-readable timestamp
        this.logger.error(
            `[${formattedTimestamp}] ${appError.message}`,
            appError.stack,
            appError.context,
            correlationId
        );

        const responseBody: ApiErrorResponse =
            env.NODE_ENV === "development"
                ? {
                      correlationId,
                      formattedTimestamp,
                      message: appError.message,
                      meta: {
                          context: appError.context,
                          stack: appError.stack,
                      },
                      path: request.url,
                      statusCode: appError.statusCode,
                      success: false,
                      timestamp: isoTimestamp,
                  }
                : {
                      correlationId,
                      message: appError.message,
                      path: request.url,
                      statusCode: appError.statusCode,
                      success: false,
                      timestamp: isoTimestamp,
                  };

        response.status(appError.statusCode).json(responseBody);
    }
}
