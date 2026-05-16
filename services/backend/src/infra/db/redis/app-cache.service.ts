// src/lib/app-cache.util.ts
import { Injectable, Logger } from "@nestjs/common";

import { env } from "@/common/env/env";

import { RedisService } from "./redis.service";

@Injectable()
export class AppCache {
    private readonly logger = new Logger(AppCache.name);
    private readonly defaultTTL = env.REDIS_EXPIRATION;

    constructor(private readonly redisService: RedisService) {}

    private get client() {
        return this.redisService.getClient();
    }

    // -------------------------
    // Generic
    // -------------------------

    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await this.client.get(key);
            return data ? (JSON.parse(data) as T) : null;
        } catch (err) {
            this.logger.error(`Cache get error [${key}]`, err);
            return null;
        }
    }

    async set<T>(key: string, value: T, ttl?: number) {
        try {
            const payload = JSON.stringify(value);

            if (ttl ?? this.defaultTTL) {
                await this.client.set(
                    key,
                    payload,
                    "EX",
                    ttl ?? this.defaultTTL
                );
            } else {
                await this.client.set(key, payload);
            }
        } catch (err) {
            this.logger.error(`Cache set error [${key}]`, err);
        }
    }

    async invalidate(key: string) {
        await this.client.del(key);
    }

    // -------------------------
    // Atomic List Handling
    // -------------------------

    async pushToList(key: string, value: unknown, ttl?: number) {
        const payload = JSON.stringify(value);

        await this.client.rpush(key, payload);

        if (ttl ?? this.defaultTTL) {
            await this.client.expire(key, ttl ?? this.defaultTTL);
        }
    }

    async getList<T>(key: string): Promise<T[]> {
        const items = await this.client.lrange(key, 0, -1);
        return items.map((i) => JSON.parse(i));
    }

    async removeFromList(key: string, value: unknown) {
        const payload = JSON.stringify(value);
        await this.client.lrem(key, 0, payload);
    }

    // -------------------------
    // Atomic Counters
    // -------------------------

    async increment(key: string, by = 1): Promise<number> {
        return this.client.incrby(key, by);
    }

    async decrement(key: string, by = 1): Promise<number> {
        return this.client.decrby(key, by);
    }

    // -------------------------
    // Read-through Wrapper
    // -------------------------

    async wrap<T>(
        key: string,
        factory: () => Promise<T>,
        ttl?: number
    ): Promise<T> {
        const cached = await this.get<T>(key);
        if (cached !== null) return cached;

        const fresh = await factory();
        await this.set(key, fresh, ttl);

        return fresh;
    }
}
