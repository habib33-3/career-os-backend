import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { publicApi } from "@/lib/axios/public";
import { getErrorMessage } from "@/lib/utils";

import { useAuthStore } from "@/stores/useAuthStore";
import type { ApiResponse, User } from "@/type/type";

import { type SignUpPayloadType } from "../validation/sign-up";

const signUpApi = async (data: SignUpPayloadType) => {
  const res = await publicApi.post<ApiResponse<User>>("/auth/register", {
    name: data.name,
    email: data.email,
    password: data.password,
  });

  return res.data;
};

const useSignUp = () => {
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: signUpApi,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Sign up failed"));
    },
    onSuccess: (data) => {
      setUser(data.data);
      toast.success(data?.message || "Sign up successful");
    },
  });
};

export default useSignUp;
