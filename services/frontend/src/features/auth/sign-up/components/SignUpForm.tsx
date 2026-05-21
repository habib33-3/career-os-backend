"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

import {
  type SignUpFormData,
  signUpValidationSchema,
} from "../../validation/sign-up";

const SignUpForm = () => {
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpValidationSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = form;

  const onSubmit = (data: SignUpFormData) => {
    // console.info("submit:", data);
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create your account to get started.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            {/* Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel>Name</FieldLabel>
              <Input
                {...register("name")}
                placeholder="John Doe"
                autoComplete="name"
              />
              <FieldError errors={errors.name ? [errors.name] : []} />
            </Field>

            {/* Email */}
            <Field data-invalid={!!errors.email}>
              <FieldLabel>Email</FieldLabel>
              <Input
                {...register("email")}
                placeholder="you@example.com"
                autoComplete="email"
              />
              <FieldError errors={errors.email ? [errors.email] : []} />
            </Field>

            {/* Password */}
            <Field data-invalid={!!errors.password}>
              <FieldLabel>Password</FieldLabel>
              <Input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <FieldError errors={errors.password ? [errors.password] : []} />
            </Field>

            {/* Confirm Password */}
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel>Confirm Password</FieldLabel>
              <Input
                {...register("confirmPassword")}
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <FieldError
                errors={errors.confirmPassword ? [errors.confirmPassword] : []}
              />
            </Field>
          </FieldGroup>

          <div className="mt-6 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
            >
              Reset
            </Button>

            <Button type="submit">Create Account</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUpForm;
