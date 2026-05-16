# Redis in NestJS: Initialization, Challenges, and Full Process

## 1. **Objective**

We want a robust Redis setup for a NestJS application that:

- Handles lifecycle events (start/shutdown)
- Provides a wrapper utility (`AppCache`) for easy cache operations
- Supports atomic operations on lists/objects
- Provides standardized error handling (`mapRedis`)
- Is ready for future extensions (BullMQ, Kafka, etc.)

---

## 2. **Key Concepts**

### 2.1 Redis Lifecycle in NestJS

- NestJS modules provide lifecycle hooks: `OnModuleInit` and `OnApplicationShutdown`.
- We use these hooks in a **`RedisService`** to initialize and cleanly close Redis connections.

### 2.2 Wrapper vs Service

- **RedisService**: Handles initialization, exposes the raw client (`Keyv` or `ioredis`), and manages lifecycle.
- **AppCache (wrapper)**: Provides high-level utility functions (`get`, `set`, `invalidate`, `list operations`) with default TTL, logging, and error handling.

---

## 3. **Implementation Steps**

### 3.1 Install Dependencies

```bash
pnpm add ioredis keyv @keyv/redis
```

- `ioredis`: low-level Redis client (atomic operations, pipelining)
- `keyv`: simple key-value wrapper for TTL and serialization
- `@keyv/redis`: Redis store adapter for Keyv

---

### 3.2 Redis Service (Lifecycle Handler)

`src/lib/redis.service.ts`

```ts
import {
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
} from "@nestjs/common";

import KeyvRedis from "@keyv/redis";
import Keyv from "keyv";

import { env } from "@/common/env/env";

import { AppLoggerService } from "@/infra/app-logger/app-logger.service";

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
    private logger = new AppLoggerService(RedisService.name);
    private client: Keyv;

    onModuleInit() {
        this.logger.log("Initializing Redis connection...");
        const store = new KeyvRedis(env.REDIS_URL); // atomic, pipelined
        this.client = new Keyv({ store, ttl: env.REDIS_EXPIRATION });
        this.logger.log("Redis initialized successfully");
    }

    getClient(): Keyv {
        if (!this.client) throw new Error("Redis not initialized yet");
        return this.client;
    }

    onApplicationShutdown(signal?: string) {
        this.logger.log(`Redis shutting down (${signal ?? "manual"})`);
    }
}
```

**Why this works:**

- Initializes Redis before the app starts
- Exposes a client for your wrapper
- Uses Keyv to handle TTL and serialization automatically

---

### 3.3 AppCache Wrapper

`src/lib/app-cache.util.ts`

```ts
import { Injectable, Logger } from "@nestjs/common";

import { env } from "@/common/env/env";

import { RedisService } from "./redis.service";

@Injectable()
export class AppCache {
    private logger = new Logger(AppCache.name);

    constructor(private readonly redisService: RedisService) {}

    private get client() {
        return this.redisService.getClient();
    }

    // Simple key-value operations
    async get<T>(key: string): Promise<T | null> {
        try {
            return (await this.client.get<T>(key)) ?? null;
        } catch (err) {
            this.logger.error(`Cache get error [${key}]: ${err}`);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl: number = env.REDIS_EXPIRATION) {
        try {
            await this.client.set(key, value, ttl);
            this.logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
        } catch (err) {
            this.logger.error(`Cache set error [${key}]: ${err}`);
        }
    }

    async invalidate(key: string) {
        try {
            await this.client.delete(key);
            this.logger.debug(`Cache invalidated: ${key}`);
        } catch (err) {
            this.logger.error(`Cache invalidate error [${key}]: ${err}`);
        }
    }

    // List/Array utilities
    async getList<T>(key: string): Promise<T[] | null> {
        return (await this.get<T[]>(key)) ?? null;
    }

    async setList<T>(
        key: string,
        list: T[],
        ttl: number = env.REDIS_EXPIRATION
    ) {
        await this.set<T[]>(key, list, ttl);
    }

    async updateListItem<T extends { id: string }>(
        key: string,
        item: T,
        ttl: number = env.REDIS_EXPIRATION
    ) {
        const list = await this.getList<T>(key);
        if (!list) return;
        const idx = list.findIndex((i) => i.id === item.id);
        if (idx >= 0) list[idx] = item;
        else list.push(item);
        await this.setList(key, list, ttl);
    }

    async removeListItem<T extends { id: string }>(
        key: string,
        id: string,
        ttl: number = env.REDIS_EXPIRATION
    ) {
        const list = await this.getList<T>(key);
        if (!list) return;
        const filtered = list.filter((i) => i.id !== id);
        await this.setList(key, filtered, ttl);
    }
}
```

**Features:**

- TTL is optional (uses a global default)
- Generic `get`/`set` with type safety
- List helpers: add, update, remove items atomically
- Full logging for debugging

---

### 3.4 Redis Error Mapper

`src/common/errors/redis.error.ts`

```ts
import { HttpStatus } from "@nestjs/common";

import type { IAppErrorMapped } from "./exception-mappers";

export function mapRedis(exception: unknown): IAppErrorMapped | null {
    const e = exception as NodeJS.ErrnoException & {
        name?: string;
        message?: string;
        stack?: string;
    };
    if (!e || typeof e !== "object") return null;

    const message = e.message ?? "";

    if (["ECONNREFUSED", "ETIMEDOUT", "EHOSTUNREACH"].includes(e.code ?? "")) {
        return {
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            message: "Redis service unavailable",
            stack: e.stack,
            context: "Redis",
        };
    }
    if (e.code === "ENOTFOUND") {
        return {
            statusCode: HttpStatus.SERVICE_UNAVAILABLE,
            message: "Redis host not found",
            stack: e.stack,
            context: "Redis",
        };
    }
    if (message.toLowerCase().includes("timeout")) {
        return {
            statusCode: HttpStatus.GATEWAY_TIMEOUT,
            message: "Redis request timed out",
            stack: e.stack,
            context: "Redis",
        };
    }
    if (message.toLowerCase().includes("noauth")) {
        return {
            statusCode: HttpStatus.UNAUTHORIZED,
            message: "Redis authentication failed",
            stack: e.stack,
            context: "Redis",
        };
    }
    if (e.name?.toLowerCase().includes("redis")) {
        return {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: "Unexpected Redis error occurred",
            stack: e.stack,
            context: "Redis",
        };
    }

    return null;
}
```

**Purpose:**

- Catch only Redis/ioredis-specific errors
- Integrates seamlessly with `mapException`

---

### 3.5 Key Management

```ts
import { env } from "@/common/env/env";

const withPrefix = (...parts: string[]) =>
    `${env.APP_NAME}-cache:${parts.join(":")}`;

// Users
export const USER_LIST_KEY = () => withPrefix("user", "list");
export const USER_DETAIL_KEY = (id: string) => withPrefix("user", "detail", id);

// Orders
export const ORDER_HISTORY_KEY = (userId: string) =>
    withPrefix("order", "history", userId);
export const ORDER_DETAIL_KEY = (orderId: string) =>
    withPrefix("order", "detail", orderId);
```

- Ensures **consistent, namespaced keys**
- Prevents collisions and simplifies invalidation

---

### 4. **Challenges & Considerations**

| Challenge                  | Solution                                                                                                                                       |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Serialization**          | Redis stores only strings/buffers. Use Keyv for automatic JSON serialization.                                                                  |
| **TTL Management**         | Set a global default TTL, allow overrides in wrapper.                                                                                          |
| **Atomic List Operations** | ioredis supports atomic commands. Currently, wrapper handles in-memory array + `set`, but can migrate to native Redis lists (`LPUSH`, `LREM`). |
| **Error Handling**         | Redis network/auth errors handled by `mapRedis`. Prisma, HTTP, and generic errors handled separately.                                          |
| **Lifecycle Management**   | NestJS hooks (`OnModuleInit`, `OnApplicationShutdown`) ensure Redis initializes before usage and shuts down cleanly.                           |
| **Extensibility**          | Wrapper can later support BullMQ, Kafka, or other Redis-based systems without changing service layer.                                          |

---

### 5. **Full Flow in Code**

```ts
// 1️⃣ Generate Key
const key = USER_LIST_KEY();

// 2️⃣ Fetch from Redis
let users = await appCache.getList<User>(key);

if (!users) {
    // 3️⃣ Fetch from DB
    users = await prisma.user.findMany();

    // 4️⃣ Set in Redis
    await appCache.setList(key, users);
}

// 5️⃣ Update an item in cache
await appCache.updateListItem(key, updatedUser);

// 6️⃣ Remove an item
await appCache.removeListItem(key, userId);
```

- Cache is transparent, TTL is automatic, errors are logged.
- Any Redis failures can be mapped and returned in API errors via `mapRedis`.

---

### 6. **Next Steps / Future Enhancements**

- Move from Keyv arrays to native Redis lists for **atomic list updates**
- Integrate **BullMQ** for job queues using the same Redis connection
- Extend wrapper to support **publish/subscribe** or **stream-based caching**
- Optional: implement **cache invalidation patterns** (e.g., LRU, pub/sub cache clearing)

---

This document now covers:

- Full Redis lifecycle in NestJS
- Wrapper utilities (`AppCache`) for high-level usage
- Error mapping specific to Redis
- Key naming conventions
- Practical usage patterns and challenges

---
