"use client";

import { useState } from "react";

import { Controller } from "react-hook-form";

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

  const { form, onSubmit, loading } = useCreateSource();

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
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>

              <FieldContent>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Medium"
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
                  placeholder="https://medium.com"
                  aria-invalid={fieldState.invalid}
                />

                <FieldDescription>
                  The website URL of the source.
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
                  placeholder="Short description..."
                  rows={4}
                  aria-invalid={fieldState.invalid}
                />

                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor="logo">Logo</FieldLabel>

          <FieldContent>
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0])}
            />

            <FieldDescription>Optional logo image.</FieldDescription>
          </FieldContent>
        </Field>
      </FieldGroup>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Source"}
      </Button>
    </form>
  );
};

export default CreateSourceForm;
