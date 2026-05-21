import { z } from "zod";

export const signUpValidationSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),

    email: z.email("Invalid email address"),

    password: z.string().min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpValidationSchema>;
