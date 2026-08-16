import { Injectable, NotFoundException } from "@nestjs/common";

import { UploadFileService } from "@/common/upload/upload-file.service";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";
import {
    companyItemWithId,
    companyListWithUserId,
} from "@/infra/db/redis/cache-key";

import { Prisma } from "@/generated/prisma/client";

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

    async getCompanies(userId: string, search?: string) {
        const cacheKey = companyListWithUserId(userId, search);

        const cached = await this.cache.get(cacheKey);

        if (cached !== null) return cached;

        const where: Prisma.CompanyWhereInput = {};

        if (search) {
            search = search.trim();

            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    country: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    address: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        const companies = await this.prisma.company.findMany({
            where,
            orderBy: {
                name: "asc",
            },
        });

        await this.cache.set(cacheKey, companies);

        return companies;
    }

    async getCompanyById(userId: string, id: string) {
        const key = companyItemWithId(userId, id);

        const cached = await this.cache.get(key);

        if (cached !== null) {
            return cached;
        }

        const company = await this.prisma.company.findFirst({
            where: { userId, id },
        });

        if (!company) throw new NotFoundException("Company not found");

        await this.cache.set(key, company);

        return company;
    }
}
