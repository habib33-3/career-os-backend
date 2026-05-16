import { Injectable, Logger } from "@nestjs/common";

import { MailerService } from "@nestjs-modules/mailer";

import { SendTemplateOptions } from "./mail.type";

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailer: MailerService) {}

    async sendEmail(options: SendTemplateOptions): Promise<boolean> {
        try {
            // Build mail options based on whether html or template is provided
            const mailOptions: Parameters<typeof this.mailer.sendMail>[0] = {
                subject: options.subject,
                to: options.to,
            };

            if (options.html) {
                // Pre-rendered HTML provided
                mailOptions.html = options.html;
            } else if (options.template) {
                // Template path provided - let mailer service handle rendering
                mailOptions.template = options.template;
                mailOptions.context = options.context ?? {};
            } else {
                throw new Error("Either 'html' or 'template' must be provided");
            }

            await this.mailer.sendMail(mailOptions);

            const identifier = options.html
                ? "HTML email"
                : `template "${options.template}"`;
            this.logger.log(`Mail ${identifier} sent to ${options.to}`);

            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown mail error";
            const identifier = options.html
                ? "HTML email"
                : `template "${options.template}"`;

            this.logger.error(
                `Failed sending ${identifier} to ${options.to}: ${message}`
            );

            return false;
        }
    }
}
