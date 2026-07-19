import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { privateApi } from "@/lib/axios/private";
import { getErrorMessage } from "@/lib/utils";

import { useAuthStore } from "@/stores/useAuthStore";

import type { ApiResponse } from "@/type/type";

const logoutApi = async () => {
  const res = await privateApi.post<
    ApiResponse<{
      message: string;
    }>
  >("/auth/logout");

  return res.data;
};

const useLogout = () => {
  const { clearUser } = useAuthStore();

  return useMutation({
    mutationFn: logoutApi,
    retry: false,

    onSettled: () => {
      // ALWAYS clear local session
      clearUser();
    },

    onSuccess: () => {
      toast.success("Logout successful");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error, "Logout failed"));
    },
  });
};

export default useLogout;
