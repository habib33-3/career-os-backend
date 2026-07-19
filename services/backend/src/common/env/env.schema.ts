import ms from "ms";
import z from "zod";

import { DEFAULT_APP_NAME, DEFAULT_PORT } from "../constants/default";
import { EnvironmentEnum } from "../constants/enum";

export const envSchema = z.object({
    ACCESS_TOKEN_EXPIRES: z
        .string()
        .transform((val) => {
            const parsed = ms(val as ms.StringValue);
            if (typeof parsed !== "number") {
                throw new Error(`Invalid ACCESS_TOKEN_EXPIRES: ${val}`);
            }
            return parsed;
        })
        .default(ms("15m")),
    ACCESS_TOKEN_SECRET: z.string(),
    ALLOWED_ORIGINS: z
        .union([z.string(), z.string().array()])
        .transform((val) => {
            // If it's already an array, return as is
            if (Array.isArray(val)) return val;

            // Split comma-separated string and trim spaces
            return val.split(",").map((v) => v.trim());
        }),

    APP_NAME: z.string().default(DEFAULT_APP_NAME),
    DATABASE_URL: z.url(),
    NODE_ENV: z.enum(EnvironmentEnum).default(EnvironmentEnum.DEVELOPMENT),
    PEPPER_SECRET: z.string(),
    PORT: z.coerce.number().default(DEFAULT_PORT),
    RATE_LIMIT_LONG_MAX: z.coerce.number().default(100),
    RATE_LIMIT_LONG_TTL: z.coerce.number().default(60),
    RATE_LIMIT_MEDIUM_MAX: z.coerce.number().default(20),
    RATE_LIMIT_MEDIUM_TTL: z.coerce.number().default(10),
    RATE_LIMIT_SHORT_MAX: z.coerce.number().default(3),
    RATE_LIMIT_SHORT_TTL: z.coerce.number().default(1),
    REDIS_EXPIRATION: z.coerce.number().default(3600),
    REDIS_URL: z.url(),
    REFRESH_TOKEN_EXPIRES: z
        .string()
        .transform((val) => {
            const parsed = ms(val as ms.StringValue);
            if (typeof parsed !== "number") {
                throw new Error(`Invalid REFRESH_TOKEN_EXPIRES: ${val}`);
            }
            return parsed;
        })
        .default(ms("7d")),

    REFRESH_TOKEN_SECRET: z.string(),

    SMTP_HOST: z.string().default("smtp.gmail.com"),
    SMTP_PASSWORD: z.string(),
    SMTP_PORT: z.coerce.number().default(587),
    SMTP_SECURE: z
        .preprocess((val) => val === "true" || val === true, z.boolean())
        .default(false),
    SMTP_USER: z.string(),
    CLOUDINARY_CLOUD_NAME: z.string(),
    CLOUDINARY_API_KEY: z.string(),
    CLOUDINARY_API_SECRET: z.string(),
});
