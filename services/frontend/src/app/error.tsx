"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import ErrorState from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route Error:", error);
  }, [error]);

  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <ErrorState
        title="Something went wrong"
        description="An unexpected error occurred while loading this page."
        action={
          <div className="flex gap-3">
            <Button onClick={() => reset()}>Try again</Button>

            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
            >
              Go to Dashboard
            </Button>
          </div>
        }
      />
    </div>
  );
}
