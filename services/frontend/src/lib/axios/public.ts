import { createApiClient } from "./core";

export const publicApi = createApiClient();

// Optional: normalize errors
publicApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const normalizedError = {
      message: error?.response?.data?.message || "Public API error",
      status: error?.response?.status,
      originalError: error,
    };
    return Promise.reject(normalizedError);
  }
);
