import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { privateApi } from "@/lib/axios/private";

import type { ApiResponse, Source } from "@/type/type";

const getAllSourceApi = async (
  search?: string,
  cursorId?: string,
  limit = 10
): Promise<ApiResponse<Source[]>> => {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (cursorId) params.append("cursorId", cursorId);
  params.append("limit", String(limit));

  const res = await privateApi.get<ApiResponse<Source[]>>(
    `/source?${params.toString()}`
  );

  return res.data;
};

const useGetAllSource = () => {
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
  });

  const limit = 10;

  const query = useInfiniteQuery<
    ApiResponse<Source[]>,
    Error,
    InfiniteData<ApiResponse<Source[]>>,
    string[],
    string | undefined
  >({
    queryKey: ["sources", search],

    queryFn: ({ pageParam }) =>
      getAllSourceApi(search || undefined, pageParam, limit),

    initialPageParam: undefined,

    getNextPageParam: (lastPage) =>
      lastPage?.meta?.cursor?.nextCursor ?? undefined,
  });

  const sources = query.data?.pages.flatMap((page) => page.data ?? []) ?? [];

  return {
    sources,
    search,
    setSearch,
    fetchNextPage: query.fetchNextPage,
    hasNextPage: query.hasNextPage,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
  };
};

export default useGetAllSource;
