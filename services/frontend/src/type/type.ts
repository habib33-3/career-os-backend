// api-response.ts

export type CursorMeta = {
  nextCursor: string | null;
  hasNext: boolean;
};

export type ApiMeta = CursorMeta | Record<string, unknown>;

export type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  timestamp: string;
  formattedTimestamp?: string;
  path: string;
  message: string;
  data: T | null;
  meta?: ApiMeta;
};

export type SuccessResponse<T> = ApiResponse<T> & {
  success: true;
  data: T;
};

export type ErrorResponse = ApiResponse<null> & {
  success: false;
};

export type ApiError = {
  message: string;
  statusCode?: number;
  meta?: Record<string, unknown>;
};
