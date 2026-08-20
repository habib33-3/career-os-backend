import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { UploadFileService } from "@/common/upload/upload-file.service";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";
import {
    companyItemWithId,
    companyListWithUserId,
} from "@/infra/db/redis/cache-key";

import { Company, Prisma } from "@/generated/prisma/client";

import { AddCompanyDto } from "./dto/add-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

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

        const cached = await this.cache.get<Company>(key);

        if (cached !== null) {
            return cached;
        }

        const company = await this.prisma.company.findFirst({
            where: { userId, id },
            include: {
                contact: true,
            },
        });

        if (!company) throw new NotFoundException("Company not found");

        await this.cache.set(key, company);

        return company;
    }

    async updateCompanyLogo(
        userId: string,
        id: string,
        file?: Express.Multer.File
    ) {
        if (!file) {
            throw new BadRequestException("File is required");
        }

        const company = await this.getCompanyById(userId, id);

        const uploaded = await this.upload.uploadFile(file, "company");

        try {
            const updated = await this.prisma.company.update({
                where: { id },
                data: {
                    logo: uploaded.url,
                },
                include: {
                    contact: true,
                },
            });

            if (company.logo) {
                await this.upload.deleteFile(company.logo);
            }

            await Promise.all([
                this.cache.invalidate(companyListWithUserId(userId)),
                this.cache.set(companyItemWithId(userId, id), updated),
            ]);

            return updated;
        } catch (error) {
            // DB update failed, so clean up the newly uploaded file
            await this.upload.deleteFile(uploaded.url);
            throw error;
        }
    }

    async updateCompany(userId: string, id: string, payload: UpdateCompanyDto) {
        await this.getCompanyById(userId, id);

        await this.prisma.$transaction(async (tx) => {
            const company = await tx.company.update({
                where: { id },
                data: {
                    name: payload.name,
                    address: payload.address,
                    country: payload.country,
                    city: payload.city,
                },
            });

            if (payload.companyContact) {
                const contact = payload.companyContact;

                await tx.companyContact.upsert({
                    where: {
                        companyId: id,
                    },
                    update: {
                        email: contact.email,
                        phone: contact.phone,
                        linkedin: contact.linkedin,
                        twitter: contact.twitter,
                        facebook: contact.facebook,
                        careerPage: contact.careerPage,
                    },
                    create: {
                        companyId: id,
                        email: contact.email,
                        phone: contact.phone,
                        linkedin: contact.linkedin,
                        twitter: contact.twitter,
                        facebook: contact.facebook,
                        careerPage: contact.careerPage,
                    },
                });
            }

            return company;
        });

        await this.cache.invalidate(companyListWithUserId(userId));

        const companyWithContact = await this.prisma.company.findFirst({
            where: {
                id,
                userId,
            },
            include: {
                contact: true,
            },
        });

        await this.cache.set(companyItemWithId(userId, id), companyWithContact);
        await this.cache.invalidate(companyListWithUserId(userId));

        return companyWithContact;
    }

    async deleteCompany(userId: string, id: string) {
        const company = await this.getCompanyById(userId, id);

        if (company.logo) {
            await this.upload.deleteFile(company.logo);
        }

        await this.prisma.company.delete({
            where: { id, userId },
        });

        await Promise.all([
            this.cache.invalidate(companyListWithUserId(userId)),
            this.cache.invalidate(companyItemWithId(userId, id)),
        ]);

        return {
            message: "Company deleted successfully",
        };
    }
}
