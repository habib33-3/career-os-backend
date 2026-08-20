import { Module } from "@nestjs/common";

import { MailService } from "./mail.service";

@Module({
    exports: [MailService],
    imports: [],
    providers: [MailService],
})
export class MailModule {}
