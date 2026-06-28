"use client";

import PageLoading from "@/components/shared/loading/PageLoading";

import useGetAllSource from "../hooks/useGetAllSource";
import SourceCard from "./SourceCard";

const SourceCards = () => {
  const { isLoading, sources } = useGetAllSource();
  console.log("🚀 ~ SourceCards ~ sources:", sources);

  if (isLoading) {
    return <PageLoading />;
  }

  if (!sources.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No sources found.</p>
      </div>
    );
  }

  return (
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
  );
};

export default SourceCards;
