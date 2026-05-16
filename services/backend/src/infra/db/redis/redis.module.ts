import { Global, Module } from "@nestjs/common";

import { AppCache } from "./app-cache.service";
import { RedisService } from "./redis.service";

@Global()
@Module({
    exports: [RedisService, AppCache],
    providers: [RedisService, AppCache],
})
export class RedisModule {}
