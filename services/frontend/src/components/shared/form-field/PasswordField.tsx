"use client";

import { useState } from "react";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import {
  type FieldErrors,
  type FieldValues,
  type Path,
  type UseFormRegister,
  get,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

type PasswordFieldProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  name: Path<T>;
  label?: string;
  className?: string;
};

export default function PasswordField<T extends FieldValues>({
  register,
  errors,
  name,
  label = "Password",
  className,
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const error = get(errors, name);

  return (
    <Field
      data-invalid={!!error}
      className={cn(className)}
    >
      <FieldLabel htmlFor={name}>{label}</FieldLabel>

      <div className="relative">
        <Input
          id={name}
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="new-password"
          className="pr-10"
        />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <EyeOffIcon className="size-4" />
          ) : (
            <EyeIcon className="size-4" />
          )}

          <span className="sr-only">
            {showPassword ? "Hide password" : "Show password"}
          </span>
        </Button>
      </div>

      <FieldError errors={error ? [error] : []} />
    </Field>
  );
}
