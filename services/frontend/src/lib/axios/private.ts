import { createApiClient } from "./core";

let onAuthFailure: (() => void) | null = null;

export const setAuthFailureHandler = (fn: () => void) => {
  onAuthFailure = fn;
};

export const privateApi = createApiClient();

// Request interceptor (future token hook)
privateApi.interceptors.request.use((config) => {
  // TODO: implement token retrieval logic with zustand
  const token = null; // later: zustand / cookie / storage

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401 || status === 403) {
      // central auth failure hook
      onAuthFailure?.();
    }

    return Promise.reject({
      message: error?.response?.data?.message || "Authentication error",
      status,
      data: error?.response?.data,
    });
  }
);
