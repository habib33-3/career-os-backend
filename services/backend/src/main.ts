import * as dns from "node:dns";

import { RequestMethod, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";

import helmet from "helmet";

import { AppModule } from "./app.module";
import { env } from "./common/env/env";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import { AppLoggerService } from "./infra/app-logger/app-logger.service";
import { AllExceptionsFilter } from "./infra/filters/http-exception.filter";
import { createCorrelationIdMiddleware } from "./infra/middleware/correlation-id.middleware";
import { createMorganMiddleware } from "./infra/middleware/morgan.middleware";
import { setupSwagger } from "./infra/swagger/swagger.setup";

// Force IPv4 first to prevent ENETUNREACH errors with nodemailer/SMTP on IPv6
dns.setDefaultResultOrder("ipv4first");

async function bootstrap() {
    const app = await NestFactory.create(AppModule, {
        logger: false,
    });

    const logger = app.get(AppLoggerService);
    app.useLogger(logger);

    app.enableShutdownHooks();

    app.enableCors({
        allowedHeaders: ["Content-Type", "Authorization", "X-Correlation-ID"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        origin: env.ALLOWED_ORIGINS,
    });

    // Middleware
    app.use(helmet());
    app.use(createCorrelationIdMiddleware());
    app.use(createMorganMiddleware(logger));

    app.setGlobalPrefix("api/v1", {
        exclude: [{ method: RequestMethod.GET, path: "health/(.*)" }],
    });

    // Global Pipes
    app.useGlobalPipes(
        new ValidationPipe({
            errorHttpStatusCode: 400,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            whitelist: true,
        })
    );

    // Global Filters & Interceptors
    app.useGlobalFilters(new AllExceptionsFilter(logger));
    app.useGlobalInterceptors(new ResponseInterceptor());

    // Swagger (only in non-production)
    if (env.NODE_ENV !== "production") {
        setupSwagger(app);
    }

    await app.listen(env.PORT);

    logger.log(`Application started on port ${env.PORT} `, "Bootstrap");

    // Handle unhandled promise rejections

    // eslint-disable-next-line n/prefer-global/process
    process.on("unhandledRejection", async (reason: unknown) => {
        logger.error(
            "Unhandled Promise Rejection",
            reason instanceof Error ? reason.stack : JSON.stringify(reason),
            "Process"
        );

        try {
            await app.close();
            logger.log(
                "Application shutdown completed after unhandledRejection",
                "Process"
            );
        } catch (err) {
            logger.error(
                "Error during shutdown",
                err instanceof Error ? err.stack : JSON.stringify(err),
                "Process"
            );
        }
    });

    // Handle uncaught exceptions

    // eslint-disable-next-line n/prefer-global/process
    process.on("uncaughtException", async (error: Error) => {
        logger.error("Uncaught Exception", error.stack, "Process");

        try {
            await app.close();
            logger.log(
                "Application shutdown completed after uncaughtException",
                "Process"
            );
        } catch (err) {
            logger.error(
                "Error during shutdown",
                err instanceof Error ? err.stack : JSON.stringify(err),
                "Process"
            );
        }
    });
}

bootstrap().catch((error) => {
    // eslint-disable-next-line no-console
    console.error("Bootstrap failed", error);
});
