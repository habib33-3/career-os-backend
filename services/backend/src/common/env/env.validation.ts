import "dotenv/config";

import { envSchema } from "./env.schema";

export const validateEnv = (env: NodeJS.ProcessEnv = process.env) => {
    const parsed = envSchema.safeParse(env);

    if (!parsed.success) {
        console.error("❌ Invalid environment variables:");

        parsed.error.issues.forEach((issue) => {
            const path = issue.path.join(".") || "<root>";
            console.error(`${path}: ${issue.message}`);
        });

        throw new Error("Environment validation failed");
    }

    return Object.freeze(parsed.data);
};
