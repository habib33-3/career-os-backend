export type CursorMeta = {
  nextCursor: string | null;
  hasNext: boolean;
};

export type ApiMeta = {
  cursor?: CursorMeta;
  nextCursor?: string | null;
  hasNext?: boolean;
} & Record<string, unknown>;

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

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
  role: "USER" | "ADMIN";
};

export type Source = {
  id: string;
  name: string;
  url: string;
  description?: string;
  logoUrl?: string | null;
};
