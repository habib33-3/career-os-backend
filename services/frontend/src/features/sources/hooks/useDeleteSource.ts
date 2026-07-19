import { useRouter } from "next/navigation";

import {
  type UseMutationOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

import { privateApi } from "@/lib/axios/private";
import { getErrorMessage } from "@/lib/utils";

import { type ApiResponse } from "@/type/type";

type DeleteSourceResponse = ApiResponse<{ message: string }>["data"];

const deleteSourceApi = async (id: string): Promise<DeleteSourceResponse> => {
  const res = await privateApi.delete<ApiResponse<{ message: string }>>(
    `source/${id}`
  );

  return res.data.data;
};

const useDeleteSource = (
  options?: Omit<
    UseMutationOptions<DeleteSourceResponse, Error, string>,
    "mutationFn"
  >
) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    ...options,
    mutationFn: deleteSourceApi,

    onSuccess: (data, variables, onMutateResult, context) => {
      toast.success("Deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["sources"],
      });

      router.push("/sources");

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },

    onError: (error, variables, onMutateResult, context) => {
      toast.error(getErrorMessage(error, "Something went wrong"));

      options?.onError?.(error, variables, onMutateResult, context);
    },
  });
};

export default useDeleteSource;
