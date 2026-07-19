import axios, { type AxiosRequestConfig } from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
}

export const createApiClient = (config?: AxiosRequestConfig) => {
  return axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...config?.headers,
    },
    ...config,
  });
};
