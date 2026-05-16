import { HttpStatus } from "@nestjs/common";

export function mapGeneric(exception: unknown) {
    if (exception instanceof Error) {
        return {
            context: "Error",
            message: exception.message,
            stack: exception.stack,
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        };
    }

    return {
        context: "Unknown",
        message: "Unknown error occurred",
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
}
