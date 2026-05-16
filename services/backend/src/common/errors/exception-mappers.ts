import { mapGeneric } from "./generic.error";
import { mapHttp } from "./http.error";
import { mapPrisma } from "./prisma.error";
import { mapRedis } from "./redis.error";

export type IAppErrorMapped = {
    statusCode: number;
    message: string;
    stack?: string;
    context?: string;
};

type MapperFn = (exception: unknown) => IAppErrorMapped | null;

const mappers: MapperFn[] = [mapPrisma, mapHttp, mapGeneric, mapRedis];

/**
 * Single function to map any exception to a standardized shape.
 */
export function mapException(exception: unknown): IAppErrorMapped {
    for (const mapper of mappers) {
        const result = mapper(exception);
        if (result) return result;
    }
    // Fallback if no mapper returned a value
    return {
        context: "Unknown",
        message: "Unknown error occurred",
        statusCode: 500,
    };
}
