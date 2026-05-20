import axios from "axios";

export const createApiClient = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
  }

  return axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
};
