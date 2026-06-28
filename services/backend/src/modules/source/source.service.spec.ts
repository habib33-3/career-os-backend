import { Test, TestingModule } from "@nestjs/testing";

import { UploadFileService } from "@/common/upload/upload-file.service";

import { PrismaService } from "@/infra/db/prisma/prisma.service";
import { AppCache } from "@/infra/db/redis/app-cache.service";

import { SourceService } from "./source.service";

describe("SourceService", () => {
    let service: SourceService;

    const prisma = {
        source: {
            findMany: jest.fn(),
        },
    };

    const cache = {
        get: jest.fn(),
        set: jest.fn(),
        invalidate: jest.fn(),
    };

    const uploadService = {
        uploadFile: jest.fn(),
    };

    beforeEach(async () => {
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SourceService,
                { provide: PrismaService, useValue: prisma },
                { provide: AppCache, useValue: cache },
                { provide: UploadFileService, useValue: uploadService },
            ],
        }).compile();

        service = module.get<SourceService>(SourceService);
    });

    it("returns paginated data with cursor metadata in a standard envelope", async () => {
        const firstPage = [
            {
                id: "1",
                name: "First Source",
                description: "First description",
            },
        ];

        prisma.source.findMany.mockResolvedValue([
            ...firstPage,
            {
                id: "2",
                name: "Second Source",
                description: "Second description",
            },
        ]);

        cache.get.mockResolvedValue(null);

        const result = await service.getAllMySources(
            "user-1",
            undefined,
            "foo",
            1
        );

        expect(result).toEqual({
            data: firstPage,
            meta: {
                cursor: {
                    nextCursor: "2",
                    hasNext: true,
                },
            },
        });
    });
});
