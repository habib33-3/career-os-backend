import { createApiClient } from "./core";

export const publicApi = createApiClient();

// Optional: normalize errors
publicApi.interceptors.response.use(
  (res) => res,
  (error) => {
    return Promise.reject({
      message: error?.response?.data?.message || "Public API error",
      status: error?.response?.status,
    });
  }
);
