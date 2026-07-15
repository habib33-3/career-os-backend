"use client";

import Link from "next/link";

import { ArrowLeft, ExternalLink, Globe, Pencil, Trash2 } from "lucide-react";

import ErrorState from "@/components/shared/ErrorState";
import PageLoading from "@/components/shared/loading/PageLoading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useGetSingleSource } from "../hooks/useGetSingleSource";

type Props = {
  id: string;
};

const SourceDetails = ({ id }: Props) => {
  const { data: source, status } = useGetSingleSource(id);

  if (status === "pending") {
    return <PageLoading />;
  }

  if (status === "error" || !source) {
    return (
      <ErrorState
        title=""
        description=""
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          asChild
        >
          <Link href="/sources">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline">
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>

          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile */}

      <Card>
        <CardContent className="flex items-center gap-6 pt-6">
          <Avatar className="h-20 w-20">
            <AvatarImage src={source.logoUrl || ""} />
            <AvatarFallback className="text-2xl">
              {source.name[0]}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">{source.name}</h1>

            <p className="mt-2 text-muted-foreground">
              {source.description || "No description provided."}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Information */}

      <Card>
        <CardHeader>
          <CardTitle>Information</CardTitle>
          <CardDescription>
            Basic information about this source.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="space-y-6 pt-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Website</p>

              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="mt-1 flex items-center gap-2 font-medium hover:underline"
              >
                <Globe className="h-4 w-4" />
                {source.url}
              </a>
            </div>

            <Button
              variant="outline"
              asChild
            >
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                Open
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">Description</p>

            <p className="mt-1">
              {source.description || "No description available."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SourceDetails;
