export type CursorMeta = {
    nextCursor: string | null;
    hasNext: boolean;
};

// Unified API response shape
export type ApiResponse<T> = {
    success: boolean; // true for success, false for errors
    statusCode: number; // HTTP status code
    timestamp: string; // ISO timestamp
    formattedTimestamp?: string; // human-readable, optional
    path: string; // full request URL
    message: string; // dynamic or error message
    data: T | null; // payload for success, null for errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    meta?: CursorMeta | Record<string, any>; // cursor for success, error info for failure
};
