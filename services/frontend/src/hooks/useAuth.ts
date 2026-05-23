import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { publicApi } from "@/lib/axios/public";

import type { ApiResponse, User } from "@/type/type";

const getMe = async () => {
  const res = await publicApi.get<ApiResponse<User>>("/auth/me");

  return res.data.data; // normalize here
};

const useAuth = () => {
  const query = useQuery<User | null>({
    queryKey: ["me"],
    queryFn: async () => {
      try {
        return await getMe();
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return {
    user: query.data ?? null,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  };
};

export default useAuth;
