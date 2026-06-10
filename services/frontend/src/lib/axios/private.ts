import createAuthRefreshInterceptor from "axios-auth-refresh";

import type { ApiResponse } from "@/type/type";

import { createApiClient } from "./core";
import { publicApi } from "./public";

/**
 * Central auth failure hook
 * (logout store, redirect to sign-in, etc.)
 */
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (fn: () => void) => {
  onAuthFailure = fn;
};

/**
 * Private API instance
 */
export const privateApi = createApiClient();

/**
 * Logout API
 * Uses publicApi to avoid interceptor loops.
 */
const logoutApi = async () => {
  try {
    await publicApi.post<ApiResponse<{ message: string }>>("/auth/logout", {});
  } catch {
    // Ignore logout failures
  }
};

/**
 * Refresh token logic
 */
const refreshAuthLogic = async () => {
  try {
    await publicApi.post("/auth/refresh", {}, {});

    return Promise.resolve();
  } catch (error) {
    await logoutApi();

    onAuthFailure?.();

    return Promise.reject(error);
  }
};

/**
 * Automatically:
 * - detects 401
 * - refreshes token
 * - retries failed requests
 */
createAuthRefreshInterceptor(privateApi, refreshAuthLogic, {
  statusCodes: [401],
});

/**
 * Global response interceptor
 */
privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // Let axios-auth-refresh handle 401s
    if (status === 401) {
      return Promise.reject(error);
    }

    // Network errors
    if (!error.response) {
      return Promise.reject({
        message: error.message || "Network error",
        status: 0,
        data: null,
      });
    }

    // API errors
    return Promise.reject({
      message:
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Request failed",
      status,
      data: error?.response?.data,
    });
  }
);

export default privateApi;
