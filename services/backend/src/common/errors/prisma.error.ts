import { HttpStatus } from "@nestjs/common";

import { Prisma } from "@/generated/prisma/client";

export function mapPrisma(exception: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const e = exception as any;

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
        let message = e.message;
        const metaStr =
            e.meta && typeof e.meta === "object"
                ? Object.entries(e.meta)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")
                : "";

        switch (e.code) {
            case "P2002":
                message = `Unique constraint failed on the field(s): ${metaStr}`;
                break;
            case "P2003":
                message = `Foreign key constraint failed on the field(s): ${metaStr}`;
                break;
            case "P2025":
                message =
                    "An operation failed because a required record was not found.";
                break;
        }

        return {
            context: "Prisma",
            message,
            stack: e.stack,
            statusCode: HttpStatus.BAD_REQUEST,
        };
    }

    if (e instanceof Prisma.PrismaClientValidationError) {
        let message = e.message.replaceAll("\n", " ").trim();
        const missingFields = [
            ...message.matchAll(/Missing a required value at `(\w+)`/g),
        ].map((m) => m[1]);

        if (missingFields.length > 0) {
            message = `Missing required field(s): ${missingFields.join(", ")}`;
        }

        return {
            context: "Prisma",
            message,
            stack: e.stack,
            statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        };
    }

    return null;
}
