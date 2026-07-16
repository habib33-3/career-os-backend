import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UploadedFile,
} from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";
import { UploadSingleFile } from "@/common/decorators/upload.decorator";

import { CreateSourceDto } from "./dto/create-source.dto";
import { SourceService } from "./source.service";

@Controller("source")
export class SourceController {
    constructor(private readonly sourceService: SourceService) {}

    @Post("")
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

    @Get("")
    @ApiOperation({
        summary: "Get all sources for the authenticated user",
        description:
            "Retrieves a list of sources linked to the authenticated user. Supports pagination and search functionality.",
    })
    @ApiQuery({ name: "cursorId", required: false, type: String })
    @ApiQuery({ name: "search", required: false, type: String })
    @ApiQuery({ name: "limit", required: false, type: Number })
    async getAllMySources(
        @CurrentUser("sub") userId: string,
        @Query("cursorId") cursorId?: string,
        @Query("search") search?: string,
        @Query("limit", new ParseIntPipe({ optional: true }))
        limit?: number
    ) {
        return this.sourceService.getAllMySources(
            userId,
            cursorId,
            search,
            limit ?? 20
        );
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get a source by ID for the authenticated user",
        description:
            "Retrieves a source linked to the authenticated user by its ID.",
    })
    @ApiParam({ name: "id", required: true, type: String })
    async getSourceById(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string
    ) {
        return this.sourceService.getSourceById(id, userId);
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update a source by ID for the authenticated user",
        description:
            "Updates a source linked to the authenticated user by its ID.",
    })
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "Source ID",
    })
    @UploadSingleFile("file", "image")
    async updateSource(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string,
        @Body() payload: CreateSourceDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.sourceService.updateSource(id, userId, payload, file);
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Delete a source by ID for the authenticated user",
        description:
            "Deletes a source linked to the authenticated user by its ID.",
    })
    @ApiParam({
        name: "id",
        required: true,
        type: String,
        description: "Source ID",
    })
    async deleteSource(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string
    ) {
        return this.sourceService.deleteSource(id, userId);
    }
}
