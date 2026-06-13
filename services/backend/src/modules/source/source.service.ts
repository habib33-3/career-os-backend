import { ConflictException, Injectable } from "@nestjs/common";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";
import { sourceListWithUserId } from "@/infra/db/redis/cache-key";

import { CreateSourceDto } from "./dto/create-source.dto";

@Injectable()
export class SourceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: AppCache
    ) {}

    async createSource(userId: string, payload: CreateSourceDto) {
        try {
            const source = await this.prisma.source.create({
                data: {
                    name: payload.name,
                    url: payload.url,
                    description: payload.description,
                    userId,
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
}
