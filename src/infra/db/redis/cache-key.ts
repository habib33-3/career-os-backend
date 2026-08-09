import { env } from "@/common/env/env";

const withPrefix = (...parts: string[]) =>
    `${env.APP_NAME}-cache:${parts.join(":")}`;

// User keys
export const userCacheKeyWithEmail = (email: string) =>
    withPrefix("user", "email", email);

export const userCacheKeyWithId = (id: string) => withPrefix("user", "id", id);

// source
export const sourceListWithUserId = (
    userId: string,
    cursorId?: string,
    search?: string,
    limit = 20
) =>
    withPrefix(
        "source",
        "list",
        userId,
        cursorId !== undefined ? `c:${cursorId}` : "c:",
        search !== undefined ? `s:${search}` : "s:",
        limit.toString()
    );

export const sourceItemWithId = (id: string, userId: string) =>
    withPrefix("source", id, userId);
