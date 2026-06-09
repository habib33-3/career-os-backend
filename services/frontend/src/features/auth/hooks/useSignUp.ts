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
  type SignUpPayloadType,
  signUpPayloadValidationSchema,
} from "../validation/sign-up";

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
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: signUpApi,
    onError: (error) => {
      toast.error(getErrorMessage(error, "Sign up failed"));
    },
    onSuccess: (data) => {
      setUser(data.data);
      toast.success(data?.message || "Sign up successful");
      router.push("/dashboard");
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpPayloadType>({
    resolver: zodResolver(signUpPayloadValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignUpPayloadType) => {
    await mutation.mutateAsync(data);
    reset();
  };

  const loading = isSubmitting || mutation.isPending;

  return {
    register,
    handleSubmit,
    onSubmit,
    errors,
    loading,
    isValid,
    mutation,
    reset,
  };
};

export default useSignUp;
