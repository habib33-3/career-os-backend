/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException } from "@nestjs/common";

export function mapHttp(exception: unknown) {
    if (exception instanceof HttpException) {
        const status = exception.getStatus();
        const response = exception.getResponse();
        let message: string;

        if (typeof response === "string") {
            message = response;
        } else if (response && typeof response === "object") {
            if (Array.isArray((response as any).message)) {
                message = (response as any).message.join(", ");
            } else if ("message" in response) {
                message = (response as any).message;
            } else {
                message = "HttpException occurred";
            }
        } else {
            message = "HttpException occurred";
        }

        return {
            context: "HttpException",
            message,
            stack: exception.stack,
            statusCode: status,
        };
    }

    return null;
}
