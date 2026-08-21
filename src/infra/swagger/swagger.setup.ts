import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { env } from "@/common/env/env";

import { ACCESS_TOKEN } from "@/modules/auth/constants/auth.constants";

export const setupSwagger = (app: INestApplication) => {
    const config = new DocumentBuilder()
        .setTitle(`${env.APP_NAME} API`)
        .setDescription("API Documentation")
        .setVersion("1.0")
        .addBearerAuth(
            {
                bearerFormat: "JWT",
                description: "Enter Access token",
                scheme: "bearer",
                type: "http",
            },
            ACCESS_TOKEN //
        )
        .addSecurityRequirements(ACCESS_TOKEN)
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api/docs", app, document, {
        customSiteTitle: `${env.APP_NAME} API Docs`,
        swaggerOptions: {
            // defaultModelsExpandDepth: -1, // Collapse all schemas/models
            deepLinking: true, // Enables URL links per endpoint
            defaultModelsExpandDepth: 1,
            displayRequestDuration: true, // Show request timing for debugging
            docExpansion: "list",
            filter: true,
            persistAuthorization: true, // Keep auth after reload
            showExtensions: false, // Optional: hide x-* extensions for cleaner UI
            withCredentials: true, // Only enable if using cookie/session auth
            // Ensure fetch/XHR include cookies when running requests from Swagger UI
            requestInterceptor: (req) => {
                // For fetch-based requests
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore - swagger-ui's req type is loose here
                if (typeof req === "object") {
                    // Some environments use `fetch` where `credentials` is required
                    // and others use XHR where `withCredentials` is used (handled by withCredentials)
                    try {
                        req.credentials = "include";
                    } catch (_e) {
                        // ignore
                    }
                }

                return req;
            },
        },
    });
};
