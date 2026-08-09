// src/infra/app-logger/app-logger.module.ts
import { Global, Module } from "@nestjs/common";

import { AppLoggerService } from "./app-logger.service";

@Global()
@Module({
    exports: [AppLoggerService],
    providers: [AppLoggerService],
})
export class AppLoggerModule {}
