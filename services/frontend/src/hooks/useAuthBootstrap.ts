import { useEffect } from "react";

import { useQuery } from "@tanstack/react-query";

import { privateApi } from "@/lib/axios/private";

import { useAuthStore } from "@/stores/useAuthStore";

import type { ApiResponse, User } from "@/type/type";

const getMeApi = async (): Promise<User | null> => {
  const res = await privateApi.get<ApiResponse<User>>("/auth/me");
  return res?.data?.data ?? null;
};

export const useAuthBootstrap = () => {
  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });

  const { setUser, clearUser, setHydrated } = useAuthStore();

  useEffect(() => {
    if (query.status === "success") {
      if (query.data) setUser(query.data);
      else clearUser();

      setHydrated(true);
    }

    if (query.status === "error") {
      clearUser();
      setHydrated(true);
    }
  }, [query.status, query.data, setUser, clearUser, setHydrated]);

  return query;
};
