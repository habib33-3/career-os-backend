import {
    Injectable,
    OnApplicationShutdown,
    OnModuleInit,
} from "@nestjs/common";

import Redis from "ioredis";

import { env } from "@/common/env/env";

import { AppLoggerService } from "@/infra/app-logger/app-logger.service";

@Injectable()
export class RedisService implements OnModuleInit, OnApplicationShutdown {
    private client: Redis;
    private isHealthy = false;

    constructor(private readonly logger: AppLoggerService) {}

    async onModuleInit() {
        this.logger.log("Initializing Redis connection...");

        this.client = new Redis(env.REDIS_URL, {
            maxRetriesPerRequest: null,
            retryStrategy: (times) => Math.min(times * 200, 2000),
        });

        this.client.on("connect", () => {
            this.logger.log("Redis connected");
        });

        this.client.on("ready", () => {
            this.isHealthy = true;
            this.logger.log("Redis ready");
        });

        this.client.on("error", (err) => {
            this.isHealthy = false;
            this.logger.error("Redis error", err.message);
        });

        this.client.on("end", () => {
            this.isHealthy = false;
            this.logger.warn("Redis connection closed");
        });

        await this.client.ping();
        this.isHealthy = true;
    }

    getClient(): Redis {
        if (!this.client) {
            throw new Error("Redis not initialized");
        }
        return this.client;
    }

    isRedisHealthy(): boolean {
        return this.isHealthy;
    }

    async onApplicationShutdown(signal?: string) {
        this.logger.log(`Redis shutting down (${signal ?? "manual"})`);
        this.isHealthy = false;
        await this.client.quit();
    }
}
