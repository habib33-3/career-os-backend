"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import PasswordField from "@/components/shared/form-field/PasswordField";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import useSignIn from "../../hooks/useSignIn";
import {
  type SignInPayloadType,
  SignInValidationSchema,
} from "../../validation/sign-in";

const SignInForm = () => {
  const form = useForm<SignInPayloadType>({
    resolver: zodResolver(SignInValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const mutation = useSignIn();

  const onSubmit = async (data: SignInPayloadType) => {
    try {
      await mutation.mutateAsync(data);

      // Optional
      reset();
    } catch {
      // Error handled inside mutation
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account.</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>

              <Input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isSubmitting || mutation.isPending}
              />

              <FieldError errors={errors.email ? [errors.email] : []} />
            </Field>

            <PasswordField
              register={register}
              errors={errors}
              name="password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || mutation.isPending}
            >
              {mutation.isPending ? "Signing In..." : "Sign In"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
