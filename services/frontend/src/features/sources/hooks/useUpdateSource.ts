import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { privateApi } from "@/lib/axios/private";
import { getErrorMessage } from "@/lib/utils";

import type { ApiResponse, Source } from "@/type/type";

import {
  type UpdateSourcePayloadType,
  UpdateSourceSchema,
} from "../validations/update-source";

type UpdateSourceVariables = {
  id: string;
  data: UpdateSourcePayloadType;
  image?: File;
};

const updateSourceApi = async ({ id, data, image }: UpdateSourceVariables) => {
  const formData = new FormData();

  if (data.name) {
    formData.append("name", data.name);
  }

  if (data.url) {
    formData.append("url", data.url);
  }

  if (data.description) {
    formData.append("description", data.description);
  }

  if (image) {
    formData.append("file", image);
  }

  const res = await privateApi.patch<ApiResponse<Source>>(
    `/source/${id}`,
    formData
  );

  return res.data;
};

const useUpdateSource = (
  id: string,
  initialValues?: UpdateSourcePayloadType
) => {
  const queryClient = useQueryClient();

  const form = useForm<UpdateSourcePayloadType>({
    mode: "onChange",
    resolver: zodResolver(UpdateSourceSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      url: initialValues?.url ?? "",
      description: initialValues?.description ?? "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateSourceApi,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });

      queryClient.invalidateQueries({
        queryKey: ["source", id],
      });

      toast.success(data.message || "Source updated successfully");
    },
    onError: (error: Error) => {
      toast.error(getErrorMessage(error, "Failed to update source"));
    },
  });

  const onSubmit = async (data: UpdateSourcePayloadType, image?: File) => {
    await mutation.mutateAsync({
      id,
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

export default useUpdateSource;
