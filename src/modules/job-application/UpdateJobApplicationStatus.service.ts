import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/infra/db/prisma/prisma.service";

@Injectable()
export class UpdateJobApplicationStatusService {
    constructor(private readonly prisma: PrismaService) {}
}
