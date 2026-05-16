import { join } from "node:path";

import { MailerOptions } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/adapters/handlebars.adapter";

import { env } from "@/common/env/env";

export const mailConfig = (): MailerOptions => {
    return {
        defaults: {
            from: `${env.APP_NAME} <${env.SMTP_USER}>`,
        },
        template: {
            adapter: new HandlebarsAdapter(),
            dir: join(process.cwd(), "src/infra/mail/templates"),
            options: {
                strict: true,
            },
        },
        transport: {
            auth: {
                pass: env.SMTP_PASSWORD,
                user: env.SMTP_USER,
            },
            connectionTimeout: 5000,
            host: env.SMTP_HOST,
            port: env.SMTP_PORT,
            secure: env.SMTP_SECURE,
        },
    };
};
