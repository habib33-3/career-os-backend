"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import { UploadIcon, XIcon } from "lucide-react";
import { Controller } from "react-hook-form";

import SectionLoading from "@/components/shared/loading/SectionLoading";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { useGetSingleSource } from "../../hooks/useGetSingleSource";
import useUpdateSource from "../../hooks/useUpdateSource";

type Props = {
  onSuccess?: () => void;
};

const UpdateSourceForm = ({ onSuccess }: Props) => {
  const { id } = useParams<{ id: string }>();

  const { data: initialData, status } = useGetSingleSource(id);

  const [image, setImage] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const { form, onSubmit, loading } = useUpdateSource(id);

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      name: initialData.name,
      url: initialData.url,
      description: initialData.description ?? "",
    });
  }, [initialData, form]);

  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  if (status === "pending") {
    return <SectionLoading />;
  }

  if (status === "error" || !initialData) {
    return null;
  }

  const displayImage = previewUrl ?? initialData.logoUrl;

  const submit = async (data: Parameters<typeof onSubmit>[0]) => {
    await onSubmit(data, image);

    setImage(undefined);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onSuccess?.();
  };

  return (
    <form
      onSubmit={(e) => form.handleSubmit(submit)(e)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Source Name</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  placeholder="LinkedIn Jobs"
                />

                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="url"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>URL</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  placeholder="https://linkedin.com/jobs"
                />

                <FieldError errors={[fieldState.error]} />

                <FieldDescription>The URL of the job source.</FieldDescription>
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Description</FieldLabel>

              <FieldContent>
                <Textarea
                  {...field}
                  rows={4}
                />

                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="source-logo">Source Logo</FieldLabel>

          <FieldContent>
            <input
              id="source-logo"
              ref={inputRef}
              type="file"
              className="sr-only"
              accept="image/*"
              aria-describedby="source-logo-description"
              onChange={(e) => setImage(e.target.files?.[0])}
            />

            <FieldDescription id="source-logo-description">
              Upload a logo image for this source.
            </FieldDescription>

            {!displayImage ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                <UploadIcon
                  aria-hidden="true"
                  className="mr-2 size-4"
                />
                Choose Logo
              </Button>
            ) : (
              <Attachment>
                <AttachmentMedia>
                  <Image
                    src={displayImage}
                    alt={`${initialData.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-md object-cover"
                    unoptimized
                  />
                </AttachmentMedia>

                <AttachmentContent>
                  <AttachmentTitle>
                    {image?.name ?? "Current Logo"}
                  </AttachmentTitle>

                  <AttachmentDescription>
                    {image
                      ? `${(image.size / 1024).toFixed(1)} KB`
                      : "Existing image"}
                  </AttachmentDescription>
                </AttachmentContent>

                <AttachmentActions>
                  <AttachmentAction
                    aria-label="Replace logo"
                    title="Replace logo"
                    onClick={() => inputRef.current?.click()}
                  >
                    <UploadIcon aria-hidden="true" />
                  </AttachmentAction>

                  <AttachmentAction
                    aria-label="Remove selected logo"
                    title="Remove selected logo"
                    onClick={() => {
                      setImage(undefined);

                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }}
                  >
                    <XIcon aria-hidden="true" />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )}
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? "Updating..." : "Update Source"}
      </Button>
    </form>
  );
};

export default UpdateSourceForm;
