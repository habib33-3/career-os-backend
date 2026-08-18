import { Injectable, Logger } from "@nestjs/common";

import { CreateEmailOptions, Resend } from "resend";

import { env } from "@/common/env/env";

import { SendEmailOptions } from "./mail.type";

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);
    private readonly resend: Resend;

    constructor() {
        this.resend = new Resend(env.RESEND_API_KEY);
    }

    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        try {
            const mailOptions: CreateEmailOptions = {
                from: env.CONTACT_EMAIL,
                to: options.to,
                subject: options.subject,
                html: options.html,
            };

            const { error } = await this.resend.emails.send(mailOptions);

            if (error) {
                throw new Error(error.message);
            }

            this.logger.log(`Mail sent to ${options.to}`);

            return true;
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown mail error";

            this.logger.error(
                `Failed sending mail to ${options.to}: ${message}`
            );

            return false;
        }
    }
}
