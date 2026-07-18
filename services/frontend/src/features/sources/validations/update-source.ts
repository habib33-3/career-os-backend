import z from "zod";

export const UpdateSourceSchema = z.object({
  name: z.string().trim().optional(),
  url: z.url().optional(),
  description: z.string().trim().optional(),
});

export type UpdateSourcePayloadType = z.infer<typeof UpdateSourceSchema>;
