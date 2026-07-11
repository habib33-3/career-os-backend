"use client";

import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

import SearchInput from "@/components/shared/form-field/SearchInput";
import PageLoading from "@/components/shared/loading/PageLoading";

import useGetAllSource from "../hooks/useGetAllSource";
import SourceCard from "./SourceCard";

const SourceCards = () => {
  const {
    isLoading,
    sources,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    search,
    setSearch,
  } = useGetAllSource();

  const { ref, inView } = useInView({
    threshold: 0,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <PageLoading />;
  }

  return (
    <section className="space-y-8">
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <SearchInput
          value={search}
          onSearch={(value) => setSearch(value || null)}
          placeholder="Search sources..."
        />
      </div>

      {sources.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 p-8 text-center">
          <h3 className="text-lg font-semibold">No sources found</h3>

          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            We couldn't find any sources matching your search. Try a different
            keyword.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {sources.map((source) => (
              <SourceCard
                key={source.id}
                {...source}
              />
            ))}
          </div>

          <div
            ref={ref}
            className="flex justify-center py-6"
          >
            {isFetchingNextPage && <PageLoading />}
          </div>
        </>
      )}
    </section>
  );
};

export default SourceCards;
