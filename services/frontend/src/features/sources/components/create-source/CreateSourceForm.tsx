"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";

import { UploadIcon, XIcon } from "lucide-react";
import { Controller } from "react-hook-form";

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

import useCreateSource from "../../hooks/useCreateSource";

type Props = {
  onSuccess?: () => void;
};

const CreateSourceForm = ({ onSuccess }: Props) => {
  const [image, setImage] = useState<File>();

  const inputRef = useRef<HTMLInputElement>(null);

  const { form, onSubmit, loading } = useCreateSource();

  const previewUrl = useMemo(() => {
    return image ? URL.createObjectURL(image) : null;
  }, [image]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const submit = async (data: Parameters<typeof onSubmit>[0]) => {
    await onSubmit(data, image);

    setImage(undefined);
    onSuccess?.();
  };

  return (
    <form
      onSubmit={form.handleSubmit(submit)}
      className="space-y-6"
    >
      <FieldGroup>
        <Controller
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Source Name</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="LinkedIn Jobs"
                  aria-invalid={fieldState.invalid}
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
              <FieldLabel htmlFor={field.name}>URL</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="https://www.linkedin.com/jobs"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  The URL of the company careers page, job board, or recruitment
                  website.
                </FieldDescription>

                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>Description</FieldLabel>

              <FieldContent>
                <Textarea
                  {...field}
                  id={field.name}
                  placeholder="Optional notes about this job source..."
                  rows={4}
                  aria-invalid={fieldState.invalid}
                />

                <FieldError errors={[fieldState.error]} />

                <FieldDescription>
                  Add notes such as the types of roles, industries, or companies
                  you use this source for.
                </FieldDescription>
              </FieldContent>
            </Field>
          )}
        />

        <Field>
          <FieldLabel>Source Logo</FieldLabel>

          <FieldContent>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setImage(e.target.files?.[0])}
            />

            {!image ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
              >
                <UploadIcon className="mr-2 size-4" />
                Choose Logo
              </Button>
            ) : (
              <Attachment>
                <AttachmentMedia>
                  {previewUrl && (
                    <Image
                      src={previewUrl}
                      alt="Logo preview"
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                      unoptimized
                    />
                  )}
                </AttachmentMedia>

                <AttachmentContent>
                  <AttachmentTitle>{image.name}</AttachmentTitle>
                  <AttachmentDescription>
                    {(image.size / 1024).toFixed(1)} KB
                  </AttachmentDescription>
                </AttachmentContent>

                <AttachmentActions>
                  <AttachmentAction
                    aria-label="Remove logo"
                    onClick={() => {
                      setImage(undefined);

                      if (inputRef.current) {
                        inputRef.current.value = "";
                      }
                    }}
                  >
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
              </Attachment>
            )}

            <FieldDescription>
              Upload an optional logo to help identify this job source.
            </FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Add Source"}
      </Button>
    </form>
  );
};

export default CreateSourceForm;
