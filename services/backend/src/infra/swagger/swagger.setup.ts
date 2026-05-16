import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { env } from "@/common/env/env";

import { ACCESS_TOKEN } from "@/modules/auth/constants/auth.constants";

export const setupSwagger = (app: INestApplication) => {
    if (env.NODE_ENV === "production") return;

    const config = new DocumentBuilder()
        .setTitle(`${env.APP_NAME} API`)
        .setDescription("API Documentation")
        .setVersion("1.0")
        .addBearerAuth(
            {
                bearerFormat: "JWT", // optional but recommended
                description: "Enter Access token",
                scheme: "bearer",
                type: "http",
            },
            ACCESS_TOKEN // 👈 this name is important
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
        },
    });
};
