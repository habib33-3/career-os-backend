import { Injectable } from "@nestjs/common";

import { UploadFileService } from "@/common/upload/upload-file.service";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";
import {
    companyItemWithId,
    companyListWithUserId,
} from "@/infra/db/redis/cache-key";

import { AddCompanyDto } from "./dto/add-company.dto";

@Injectable()
export class CompanyService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: AppCache,
        private readonly upload: UploadFileService
    ) {}

    async addCompany(userId: string, payload: AddCompanyDto) {
        const company = await this.prisma.company.create({
            data: {
                userId,
                country: payload.country,
                name: payload.name,
                address: payload.address,
            },
        });

        await Promise.all([
            this.cache.invalidate(companyListWithUserId(userId)),
            this.cache.set(companyItemWithId(userId, company.id), company),
        ]);

        return company;
    }
}
