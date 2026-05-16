// src/infra/app-logger/app-logger.config.ts
import { env } from "@/common/env/env";

export const logConfig = {
    datePattern: "YYYY-MM-DD",
    level: env.NODE_ENV === "production" ? "info" : "debug",
    maxFiles: "14d",
    zippedArchive: true,
};
