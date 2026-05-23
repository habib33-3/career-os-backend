import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { publicApi } from "@/lib/axios/public";
import { getErrorMessage } from "@/lib/utils";

import type { ApiResponse } from "@/type/type";

import { type SignInPayloadType } from "../validation/sign-in";

const signInApi = async (data: SignInPayloadType) => {
  const res = await publicApi.post<
    ApiResponse<{
      token: {
        accessToken: string;
        refreshToken: string;
      };
    }>
  >("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return res.data;
};

const useSignIn = () => {
  return useMutation({
    mutationFn: signInApi,
    onSuccess: (data) => {
      toast.success(data?.message || "Login successful");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed"));
    },
  });
};

export default useSignIn;
