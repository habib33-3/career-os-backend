import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { publicApi } from "@/lib/axios/public";
import { getErrorMessage } from "@/lib/utils";

import { useAuthStore } from "@/stores/useAuthStore";

import type { ApiResponse, User } from "@/type/type";

import {
  type SignInPayloadType,
  SignInValidationSchema,
} from "../validation/sign-in";

const signInApi = async (data: SignInPayloadType) => {
  const res = await publicApi.post<ApiResponse<User>>("/auth/login", {
    email: data.email,
    password: data.password,
  });

  return res.data;
};

const useSignIn = () => {
  const { setUser } = useAuthStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signInApi,
    onSuccess: (data) => {
      setUser(data.data);
      toast.success(data?.message || "Login successful");
      router.push("/dashboard");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Login failed"));
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInPayloadType>({
    resolver: zodResolver(SignInValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignInPayloadType) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch {
      // handled globally in mutation
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    loading: mutation.isPending || isSubmitting,
    isValid,
    onSubmit,
  };
};

export default useSignIn;
