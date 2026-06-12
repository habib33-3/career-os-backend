import createAuthRefreshInterceptor from "axios-auth-refresh";

import { useAuthStore } from "@/stores/useAuthStore";

import type { ApiResponse } from "@/type/type";

import { createApiClient } from "./core";
import { publicApi } from "./public";

export const privateApi = createApiClient();

/**
 * single handler (set once at app bootstrap)
 */
let onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (fn: () => void) => {
  onAuthFailure = fn;
};

/**
 * prevent multiple refresh calls
 */
let isRefreshing = false;
let queue: Array<() => void> = [];

const processQueue = () => {
  queue.forEach((cb) => cb());
  queue = [];
};

const logoutApi = async () => {
  try {
    await publicApi.post<ApiResponse<{ message: string }>>("/auth/logout", {});
  } catch {
    // ignore
  }
};

const refreshAuthLogic = async () => {
  if (isRefreshing) {
    return new Promise<void>((resolve) => {
      queue.push(() => resolve());
    });
  }

  isRefreshing = true;

  try {
    await publicApi.post("/auth/refresh", {}, {});
    processQueue();
    return Promise.resolve();
  } catch (error) {
    await logoutApi();

    useAuthStore.getState().clearUser();
    onAuthFailure?.();

    return Promise.reject(error);
  } finally {
    isRefreshing = false;
  }
};

createAuthRefreshInterceptor(privateApi, refreshAuthLogic, {
  statusCodes: [401],
});

privateApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      return Promise.reject({
        message: error.message || "Network error",
        status: 0,
      });
    }

    return Promise.reject({
      message:
        error?.response?.data?.message ??
        error?.response?.data?.error ??
        "Request failed",
      status: error.response.status,
      data: error.response.data,
    });
  }
);
