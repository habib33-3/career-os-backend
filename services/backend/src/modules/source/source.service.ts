import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

import { UploadFileService } from "@/common/upload/upload-file.service";

import { AppLoggerService } from "@/infra/app-logger/app-logger.service";
import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";
import {
    sourceItemWithId,
    sourceListWithUserId,
} from "@/infra/db/redis/cache-key";

import { Prisma, Source } from "@/generated/prisma/client";

import { CreateSourceDto } from "./dto/create-source.dto";
import { UpdateSourceDto } from "./dto/update-source.dto";

@Injectable()
export class SourceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: AppCache,
        private readonly uploadService: UploadFileService,
        private readonly logger: AppLoggerService
    ) {}

    async createSource(
        userId: string,
        payload: CreateSourceDto,
        file?: Express.Multer.File
    ) {
        try {
            let fileUrl = "";

            if (file) {
                const uploaded = await this.uploadService.uploadFile(
                    file,
                    "source"
                );

                fileUrl = uploaded.url;
            }

            const source = await this.prisma.source.create({
                data: {
                    name: payload.name,
                    url: payload.url,
                    description: payload.description,
                    userId,
                    logoUrl: fileUrl,
                },
            });

            await this.cache.invalidate(sourceListWithUserId(userId));

            return source;
        } catch (error) {
            if (error.code === "P2002") {
                throw new ConflictException(
                    "Source with this name already exists for the user"
                );
            }
            throw error;
        }
    }

    async getAllMySources(
        userId: string,
        cursorId?: string,
        search?: string,
        limit = 20
    ) {
        // hard safety cap
        limit = Math.min(limit, 50);

        const cacheKey = sourceListWithUserId(userId, cursorId, search, limit);

        // 1. cache first
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        // 2. build query
        const where: Prisma.SourceWhereInput = {
            userId,
        };

        if (search?.trim()) {
            where.OR = [
                {
                    name: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
            ];
        }

        // 3. fetch with stable ordering + cursor pagination
        const sources = await this.prisma.source.findMany({
            where,
            orderBy: [
                { createdAt: "desc" },
                { id: "desc" }, // stabilizes sorting
            ],
            take: limit + 1,
            cursor: cursorId ? { id: cursorId } : undefined,
            skip: cursorId ? 1 : 0,
        });

        // 4. compute pagination safely
        const hasNextPage = sources.length > limit;

        const paginatedSources = hasNextPage
            ? sources.slice(0, limit)
            : sources;

        const nextCursor = hasNextPage
            ? // eslint-disable-next-line security/detect-object-injection
              sources[limit].id
            : null;

        const result = {
            data: paginatedSources,
            meta: {
                cursor: {
                    nextCursor,
                    hasNext: hasNextPage,
                },
            },
        };

        // 5. cache result (add TTL if your cache supports it)
        await this.cache.set(cacheKey, result);

        return result;
    }

    async getSourceById(id: string, userId: string) {
        const key = sourceItemWithId(userId, id);

        const cached = await this.cache.get<{
            status: "missing" | "found";
            data?: Source;
        }>(key);

        if (cached?.status === "found") {
            return cached.data;
        }

        if (cached?.status === "missing") {
            throw new NotFoundException("Source not found");
        }

        const source = await this.prisma.source.findFirst({
            where: { id, userId },
        });

        if (!source) {
            await this.cache.set(key, {
                status: "missing",
            });

            throw new NotFoundException("Source not found");
        }

        await this.cache.set(key, {
            status: "found",
            data: source,
        });

        return source;
    }

    async updateSource(
        id: string,
        userId: string,
        payload: UpdateSourceDto,
        file?: Express.Multer.File
    ) {
        const source = await this.getSourceById(id, userId);

        let uploaded:
            | {
                  url: string;
              }
            | undefined;

        if (file) {
            uploaded = await this.uploadService.uploadFile(file, "source");
        }

        try {
            const updatedSource = await this.prisma.$transaction(async (tx) => {
                const updateData: Prisma.SourceUpdateInput = {
                    ...payload,
                };

                if (uploaded) {
                    updateData.logoUrl = uploaded.url;
                }

                return tx.source.update({
                    where: { id },
                    data: updateData,
                });
            });

            if (!source) {
                throw new NotFoundException("Source not found");
            }

            // Best-effort cleanup
            if (uploaded && source.logoUrl) {
                this.uploadService.deleteFile(source.logoUrl).catch((err) => {
                    this.logger.error("Failed to delete old source logo:", err);
                });
            }

            await Promise.all([
                this.cache.invalidate(sourceListWithUserId(userId)),
                this.cache.invalidate(sourceItemWithId(id, userId)),
            ]);

            return updatedSource;
        } catch (error) {
            // Roll back newly uploaded image
            if (uploaded) {
                await this.uploadService.deleteFile(uploaded.url).catch(() => {
                    this.logger.error("Failed to delete uploaded source logo.");
                });
            }

            if (
                error instanceof Prisma.PrismaClientKnownRequestError &&
                error.code === "P2002"
            ) {
                throw new ConflictException(
                    "A source with this URL already exists."
                );
            }

            throw error;
        }
    }

    async deleteSource(id: string, userId: string) {
        const source = await this.getSourceById(id, userId);

        if (!source) {
            throw new NotFoundException("Source not found");
        }

        await this.prisma.source.delete({
            where: { id },
        });

        await Promise.all([
            this.cache.invalidate(sourceListWithUserId(userId)),
            this.cache.invalidate(sourceItemWithId(id, userId)),
        ]);

        return {
            message: "Source deleted successfully",
        };
    }
}
