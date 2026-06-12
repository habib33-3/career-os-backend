import { z } from "zod";

export const signUpPayloadValidationSchema = z
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

export type SignUpPayloadType = z.infer<typeof signUpPayloadValidationSchema>;
