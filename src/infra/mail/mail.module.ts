import { Module } from "@nestjs/common";

import { MailerModule } from "@nestjs-modules/mailer";

import { mailConfig } from "./mail.config";
import { MailService } from "./mail.service";

@Module({
    exports: [MailService],
    imports: [MailerModule.forRoot(mailConfig())],
    providers: [MailService],
})
export class MailModule {}
