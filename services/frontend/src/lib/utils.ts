import { AxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: unknown, fallback?: string): string => {
  // Axios error
  if (error instanceof AxiosError) {
    return error.response?.data?.message || error.message || "Request failed";
  }

  // Normal JS error
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback
  return fallback || "Something went wrong";
};
