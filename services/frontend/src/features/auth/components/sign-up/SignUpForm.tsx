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

import useSignUp from "../../hooks/useSignUp";
import {
  type SignUpPayloadType,
  signUpPayloadValidationSchema,
} from "../../validation/sign-up";

const SignUpForm = () => {
  const mutation = useSignUp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<SignUpPayloadType>({
    resolver: zodResolver(signUpPayloadValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignUpPayloadType) => {
    await mutation.mutateAsync(data);
    reset();
  };

  const loading = isSubmitting || mutation.isPending;

  return (
    <div className="w-full max-w-md">
      {/* subtle brand glow */}
      <div className="absolute -z-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />

      <Card className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xl">
        {/* HEADER */}
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-semibold tracking-tight">
            Create account
          </CardTitle>

          <CardDescription className="text-muted-foreground">
            Join and start managing your workspace
          </CardDescription>
        </CardHeader>

        {/* BODY */}
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup className="space-y-5">
              {/* NAME */}
              <Field data-invalid={!!errors.name}>
                <FieldLabel>Name</FieldLabel>
                <Input
                  {...register("name")}
                  placeholder="John Doe"
                  autoComplete="name"
                  disabled={loading}
                  className="border-border/60 bg-muted/30 focus-visible:ring-primary"
                />
                <FieldError errors={errors.name ? [errors.name] : []} />
              </Field>

              {/* EMAIL */}
              <Field data-invalid={!!errors.email}>
                <FieldLabel>Email</FieldLabel>
                <Input
                  {...register("email")}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={loading}
                  className="border-border/60 bg-muted/30 focus-visible:ring-primary"
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

              {/* CONFIRM PASSWORD */}
              <PasswordField
                register={register}
                errors={errors}
                name="confirmPassword"
                label="Confirm Password"
              />

              {/* PRIMARY CTA */}
              <Button
                type="submit"
                disabled={loading || !isValid}
                className="w-full bg-primary text-primary-foreground shadow-md shadow-primary/20 transition hover:bg-primary/90"
              >
                {mutation.isPending ? "Creating account..." : "Create account"}
              </Button>

              {/* RESET (de-emphasized UX role) */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
                disabled={loading}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Reset form
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {/* FOOTER (outside card = cleaner hierarchy) */}
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
