"use client";

import Link from "next/link";

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
  const mutation = useSignIn();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignInPayloadType>({
    resolver: zodResolver(SignInValidationSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignInPayloadType) => {
    try {
      await mutation.mutateAsync(data);
      reset();
    } catch {
      // handled globally in mutation
    }
  };

  const loading = isSubmitting || mutation.isPending;

  return (
    <Card className="w-full max-w-md rounded-2xl border border-border/60 bg-card shadow-xl">
      {/* HEADER */}
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-semibold tracking-tight">
          Sign in
        </CardTitle>

        <CardDescription className="text-muted-foreground">
          Welcome back. Continue your journey.
        </CardDescription>
      </CardHeader>

      {/* BODY */}
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FieldGroup className="space-y-5">
            {/* EMAIL */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>

              <Input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                disabled={loading}
                className="border-border bg-background transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30"
                {...register("email")}
              />

              <FieldError errors={errors.email ? [errors.email] : []} />
            </Field>

            {/* PASSWORD */}
            <PasswordField
              register={register}
              errors={errors}
              name="password"
              label="Password"
            />

            {/* SUBMIT */}
            <Button
              type="submit"
              disabled={loading || !isValid}
              className="w-full bg-primary text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
            >
              {mutation.isPending ? "Signing in..." : "Sign in"}
            </Button>

            {/* FOOTER TEXT */}
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="cursor-pointer text-primary hover:underline">
                terms
              </span>{" "}
              and privacy policy.
            </p>

            {/* FOOTER LINK */}
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/sign-up"
                className="cursor-pointer text-primary hover:underline"
              >
                sign up
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
