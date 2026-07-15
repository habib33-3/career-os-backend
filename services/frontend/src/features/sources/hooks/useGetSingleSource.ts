import { useQuery } from "@tanstack/react-query";

import { privateApi } from "@/lib/axios/private";

import type { ApiResponse, Source } from "@/type/type";

const getSingleSource = async (id: string) => {
  const { data } = await privateApi.get<ApiResponse<Source>>(`/source/${id}`);

  return data.data;
};

export const useGetSingleSource = (id: string) => {
  return useQuery({
    queryKey: ["source", id],
    queryFn: () => getSingleSource(id),
    enabled: Boolean(id),
  });
};
