import { env } from "@/common/env/env";

const withPrefix = (...parts: string[]) =>
    `${env.APP_NAME}-cache:${parts.join(":")}`;

// User keys
export const userCacheKeyWithEmail = (email: string) =>
    withPrefix("user", "email", email);

export const userCacheKeyWithId = (id: string) => withPrefix("user", "id", id);

// source
export const sourceListWithUserId = (userId: string) =>
    withPrefix("source", "list", userId);
