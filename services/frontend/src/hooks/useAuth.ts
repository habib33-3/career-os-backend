import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { publicApi } from "@/lib/axios/public";

import { useAuthStore } from "@/stores/useAuthStore";
import type { ApiResponse, User } from "@/type/type";

const getMe = async () => {
  const res = await publicApi.get<ApiResponse<User>>("/auth/me");
  return res.data.data;
};

const useAuth = () => {
  const { user, setUser, clearUser } = useAuthStore();

  const query = useQuery<User | null>({
    queryKey: ["auth"],
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
    staleTime: Infinity,
  });

  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated: !!user,
    refetch: query.refetch,
  };
};

export default useAuth;
