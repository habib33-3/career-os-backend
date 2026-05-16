import {
    BeforeApplicationShutdown,
    Injectable,
    OnModuleInit,
} from "@nestjs/common";

import { PrismaPg } from "@prisma/adapter-pg";

import { env } from "@/common/env/env";

import { PrismaClient } from "@/generated/prisma/client";
import { AppLoggerService } from "@/infra/app-logger/app-logger.service";

@Injectable()
export class PrismaService
    extends PrismaClient
    implements OnModuleInit, BeforeApplicationShutdown
{
    private readonly logger = new AppLoggerService(PrismaService.name);

    constructor() {
        super({
            adapter: new PrismaPg({
                connectionString: env.DATABASE_URL,
                connectionTimeoutMillis: 5000,
                idleTimeoutMillis: 30000,
                max: 10,
            }),
            log:
                env.NODE_ENV === "production"
                    ? ["warn", "error"]
                    : ["query", "info", "warn", "error"],
        });
    }

    async onModuleInit(): Promise<void> {
        this.logger.log("Connecting to database...");
        await this.connectWithRetry();
        this.logger.log("Database connected");
    }

    async beforeApplicationShutdown(signal?: string): Promise<void> {
        if (signal) this.logger.warn(`Database disconnecting (${signal})`);
        await this.$disconnect();
    }

    async isHealthy(): Promise<boolean> {
        try {
            await this.$queryRaw`SELECT 1`;
            return true;
        } catch {
            return false;
        }
    }

    private async connectWithRetry(retries = 5, delayMs = 1000): Promise<void> {
        let attempt = 0;
        while (true) {
            try {
                attempt++;
                this.logger.log(`DB connection attempt ${attempt}`);
                await this.$connect();
                return;
            } catch (error) {
                if (attempt >= retries) {
                    this.logger.error(
                        ` Failed to connect to DB after retries ${String(error)}`
                    );
                    throw error;
                }
                const backoff = delayMs * attempt;
                this.logger.warn(
                    `DB connection failed, retrying in ${backoff}ms`
                );
                await new Promise((r) => setTimeout(r, backoff));
            }
        }
    }
}
