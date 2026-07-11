"use client";

import { useEffect } from "react";

import { useInView } from "react-intersection-observer";

import PageLoading from "@/components/shared/loading/PageLoading";

import useGetAllSource from "../hooks/useGetAllSource";
import SourceCard from "./SourceCard";

const SourceCards = () => {
  const { isLoading, sources, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetAllSource();

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

  if (sources.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No sources found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
        {sources.map((source) => (
          <SourceCard
            key={source.id}
            id={source.id}
            name={source.name}
            logoUrl={source.logoUrl}
          />
        ))}
      </div>

      {hasNextPage && (
        <div
          ref={ref}
          className="flex justify-center py-6"
        >
          {isFetchingNextPage && <PageLoading />}
        </div>
      )}
    </>
  );
};

export default SourceCards;
