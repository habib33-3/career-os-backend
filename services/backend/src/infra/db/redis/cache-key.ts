import { env } from "@/common/env/env";

const withPrefix = (...parts: string[]) =>
    `${env.APP_NAME}-cache:${parts.join(":")}`;

// User keys
export const USER_LIST_KEY = () => withPrefix("user", "list");
export const USER_DETAIL_KEY = (id: string) => withPrefix("user", "detail", id);

// Product keys
export const PRODUCT_LIST_KEY = () => withPrefix("product", "list");
export const PRODUCT_DETAIL_KEY = (id: string) =>
    withPrefix("product", "detail", id);

// Order keys
export const ORDER_HISTORY_KEY = (userId: string) =>
    withPrefix("order", "history", userId);
export const ORDER_DETAIL_KEY = (orderId: string) =>
    withPrefix("order", "detail", orderId);
