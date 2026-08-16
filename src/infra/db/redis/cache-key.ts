import { env } from "@/common/env/env";

const withPrefix = (...parts: (string | number | undefined | null)[]) =>
    `${env.APP_NAME}-cache:${parts
        .filter((part) => part !== undefined && part !== null && part !== "")
        .join(":")}`;

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

// company
export const companyListWithUserId = (userId: string, search = "") =>
    withPrefix("company", "list", userId, search);

export const companyItemWithId = (id: string, userId: string) =>
    withPrefix("company", id, userId);
