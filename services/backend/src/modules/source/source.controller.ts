import { Body, Controller, Post, UploadedFile } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";
import { UploadSingleFile } from "@/common/decorators/upload.decorator";

import { CreateSourceDto } from "./dto/create-source.dto";
import { SourceService } from "./source.service";

@Controller("source")
export class SourceController {
    constructor(private readonly sourceService: SourceService) {}

    @Post("create")
    @ApiOperation({
        summary: "Create a new source for the authenticated user",
        description:
            "Creates a source linked to the authenticated user. Each user can have only one source with the same name. Returns the created source.",
    })
    @UploadSingleFile("file", "image")
    async createSource(
        @CurrentUser("sub") userId: string,
        @Body() payload: CreateSourceDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.sourceService.createSource(userId, payload, file);
    }
}
