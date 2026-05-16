import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from "@nestjs/common";

import { format } from "date-fns";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { ApiResponse, CursorMeta } from "@/types/response.type";

export type ResponseOverride<T> = {
    data: T;
    message?: string;
    meta?: {
        cursor?: CursorMeta;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
};

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
    T,
    ApiResponse<T>
> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>
    ): Observable<ApiResponse<T>> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse(); // get res object
        const protocol = request.protocol;
        const host = request.get("host");
        const path = `${protocol}://${host}${request.originalUrl}`;

        const now = new Date();
        const isoTimestamp = now.toISOString();
        const formattedTimestamp = format(now, "yyyy-MM-dd HH:mm:ss.SSS");

        return next.handle().pipe(
            map((resData: T | ResponseOverride<T>) => {
                let data: T;
                let message: string;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let meta: CursorMeta | Record<string, any> | undefined;

                if (
                    typeof resData === "object" &&
                    resData !== null &&
                    "data" in resData
                ) {
                    data = resData.data;
                    message =
                        resData.message ??
                        this.getDefaultMessage(request.method, data);
                    meta = resData.meta;
                } else {
                    data = resData as T;
                    message = this.getDefaultMessage(request.method, data);
                    meta = undefined;
                }

                // Use the response status code set in controller; default to 200
                const statusCode = response.statusCode || 200;

                return {
                    data,
                    formattedTimestamp,
                    message,
                    meta,
                    path,
                    statusCode,
                    success: statusCode >= 200 && statusCode < 400, // success if 2xx/3xx
                    timestamp: isoTimestamp,
                } as ApiResponse<T>;
            })
        );
    }

    private getDefaultMessage<T>(method: string, data: T): string {
        switch (method.toUpperCase()) {
            case "GET":
                return Array.isArray(data)
                    ? `Fetched ${data.length} item(s) successfully`
                    : "Fetched item successfully";
            case "POST":
                return "Created successfully";
            case "PUT":
            case "PATCH":
                return "Updated successfully";
            case "DELETE":
                return "Deleted successfully";
            default:
                return "Request successful";
        }
    }
}
