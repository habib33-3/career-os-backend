"use client";

import Link from "next/link";

import { ArrowLeft, ExternalLink, Globe, Trash2 } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import PageLoading from "@/components/shared/loading/PageLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetSingleSource } from "../hooks/useGetSingleSource";
import UpdateSourceDialog from "./update-source/UpdateSourceDialog";

type Props = {
  id: string;
};

const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
    <div className="sm:max-w-45">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
    </div>

    <div className="flex-1">{children}</div>
  </div>
);

const SourceDetails = ({ id }: Props) => {
  const { data: source, status } = useGetSingleSource(id);

  if (status === "pending") {
    return <PageLoading />;
  }

  if (status === "error" || !source) {
    return (
      <ErrorState
        title="Source not found"
        description="The source does not exist or you don't have permission to view it."
      />
    );
  }

  const initials = source.name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const hostname = (() => {
    try {
      return new URL(source.url).hostname.replace("www.", "");
    } catch {
      return source.url;
    }
  })();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Button
        variant="ghost"
        asChild
        className="px-0"
      >
        <Link href="/sources">
          <ArrowLeft className="mr-2 size-4" />
          Back to Sources
        </Link>
      </Button>

      {/* Header */}

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Avatar className="size-24 rounded-xl">
              <AvatarImage src={source.logoUrl ?? ""} />
              <AvatarFallback className="rounded-xl text-2xl font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {source.name}
              </h1>

              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
              >
                <Globe className="size-4" />
                {hostname}

                <ExternalLink className="size-3" />
              </a>
            </div>
          </div>

          <div className="flex gap-2">
            <UpdateSourceDialog />

            <Button variant="destructive">
              <Trash2 className="mr-2 size-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Information */}

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>

          <CardDescription>
            Details about this application source.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 p-6">
          <InfoRow label="Website">
            <div className="flex items-center justify-between gap-4">
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 font-medium hover:underline"
              >
                <Globe className="size-4" />
                {hostname}
              </a>

              <Button
                variant="outline"
                size="sm"
                asChild
              >
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open
                  <ExternalLink className="ml-2 size-4" />
                </a>
              </Button>
            </div>
          </InfoRow>

          <Separator />

          <InfoRow label="Description">
            <p className="leading-7 text-muted-foreground">
              {source.description || "No description provided."}
            </p>
          </InfoRow>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceDetails;
