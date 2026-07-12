import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { privateApi } from "@/lib/axios/private";
import { getErrorMessage } from "@/lib/utils";

import type { ApiResponse, Source } from "@/type/type";

import {
  type CreateSourcePayloadType,
  CreateSourceValidationSchema,
} from "../validations/create-source";

type CreateSourceVariables = {
  data: CreateSourcePayloadType;
  image?: File;
};

const createSourceApi = async ({
  data,
  image,
}: CreateSourceVariables): Promise<ApiResponse<Source>> => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("url", data.url);

  if (data.description) {
    formData.append("description", data.description);
  }

  if (image) {
    formData.append("file", image);
  }

  const res = await privateApi.post<ApiResponse<Source>>("/source", formData);

  return res.data;
};

const useCreateSource = () => {
  const form = useForm<CreateSourcePayloadType>({
    mode: "onChange",
    resolver: zodResolver(CreateSourceValidationSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createSourceApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });
      toast.success(data.message || "Source created successfully");
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, "Failed to create source"));
    },
  });

  const onSubmit = async (data: CreateSourcePayloadType, image?: File) => {
    await mutation.mutateAsync({
      data,
      image,
    });
  };

  return {
    form,
    onSubmit,
    loading: form.formState.isSubmitting || mutation.isPending,
  };
};

export default useCreateSource;
