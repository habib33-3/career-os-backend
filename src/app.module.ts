import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { env } from "./common/env/env";
import { validateEnv } from "./common/env/env.validation";
import { UploadFileModule } from "./common/upload/upload-file.module";
import { AppLoggerModule } from "./infra/app-logger/app-logger.module";
import { PrismaModule } from "./infra/db/prisma/prisma.module";
import { RedisModule } from "./infra/db/redis/redis.module";
import { AuthModule } from "./modules/auth/auth.module";
import { AccessTokenAuthGuard } from "./modules/auth/guard/access-token.guard";
import { CompanyModule } from "./modules/company/company.module";
import { SourceModule } from "./modules/source/source.module";

@Module({
    controllers: [AppController],
    imports: [
        ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
        AppLoggerModule,
        ThrottlerModule.forRoot([
            {
                name: "short",
                ttl: env.RATE_LIMIT_SHORT_TTL,
                limit: env.RATE_LIMIT_SHORT_MAX,
            },
            {
                name: "medium",
                ttl: env.RATE_LIMIT_MEDIUM_TTL,
                limit: env.RATE_LIMIT_MEDIUM_MAX,
            },
            {
                name: "long",
                ttl: env.RATE_LIMIT_LONG_TTL,
                limit: env.RATE_LIMIT_LONG_MAX,
            },
        ]),
        AuthModule,
        PrismaModule,
        RedisModule,
        SourceModule,
        UploadFileModule,
        CompanyModule,
    ],
    providers: [
        AppService,
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        { provide: APP_GUARD, useClass: AccessTokenAuthGuard },
    ],
})
export class AppModule {}
