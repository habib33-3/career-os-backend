import z from "zod";

export const CreateSourceValidationSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  url: z.url(),
  description: z.string().trim().optional(),
});

export type CreateSourcePayloadType = z.infer<
  typeof CreateSourceValidationSchema
>;
