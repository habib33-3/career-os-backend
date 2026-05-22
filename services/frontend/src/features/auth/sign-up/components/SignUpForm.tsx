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

import useSignUp from "../../hooks/useSignUp";
import {
  type SignUpPayloadType,
  signUpPayloadValidationSchema,
} from "../../validation/sign-up";

const SignUpForm = () => {
  const form = useForm<SignUpPayloadType>({
    resolver: zodResolver(signUpPayloadValidationSchema),
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

  const mutation = useSignUp();

  const onSubmit = async (data: SignUpPayloadType) => {
    await mutation.mutateAsync(data);
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
            <PasswordField
              register={register}
              errors={errors}
              name="password"
            />

            {/* Confirm Password */}
            <PasswordField
              register={register}
              errors={errors}
              name="confirmPassword"
            />
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
