import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
    UploadedFile,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";
import { UploadSingleFile } from "@/common/decorators/upload.decorator";

import { CompanyService } from "./company.service";
import { AddCompanyDto } from "./dto/add-company.dto";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post()
    @ApiOperation({
        summary: "Add Company",
        description: "Creates a new company for the authenticated user.",
    })
    @HttpCode(HttpStatus.CREATED)
    async addCompany(
        @CurrentUser("sub") userId: string,
        @Body() addCompanyDto: AddCompanyDto
    ) {
        return this.companyService.addCompany(userId, addCompanyDto);
    }

    @Get()
    @ApiOperation({
        summary: "Get Companies",
        description:
            "Returns all companies belonging to the authenticated user.",
    })
    @ApiQuery({
        name: "search",
        required: false,
        type: String,
        description: "Filter companies by name, country, or address.",
    })
    async getCompanies(
        @CurrentUser("sub") userId: string,
        @Query("search") search?: string
    ) {
        return this.companyService.getCompanies(userId, search);
    }

    @Get(":id")
    @ApiOperation({
        summary: "Get Company",
        description:
            "Returns a specific company belonging to the authenticated user.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "The ID of the company to retrieve.",
        example: "cm123456789",
    })
    async getCompany(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string
    ) {
        return this.companyService.getCompanyById(userId, id);
    }

    @Patch(":id/logo")
    @ApiOperation({
        summary: "Update Company Logo",
        description:
            "Updates the logo of a specific company belonging to the authenticated user.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "The ID of the company to update.",
    })
    @UploadSingleFile("file", "image")
    @ApiBody({
        description:
            "Optional logo image file for the company (e.g., PNG, JPG)",
        schema: {
            type: "object",
            properties: {
                file: {
                    type: "string",
                    format: "binary",
                    description:
                        "Optional logo image file for the company (e.g., PNG, JPG)",
                },
            },
        },
    })
    async updateCompanyLogo(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.companyService.updateCompanyLogo(userId, id, file);
    }

    @Patch(":id")
    @ApiOperation({
        summary: "Update Company",
        description:
            "Updates a specific company belonging to the authenticated user.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "The ID of the company to update.",
        example: "cm123456789",
    })
    async updateCompany(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string,
        @Body() updateCompanyDto: UpdateCompanyDto
    ) {
        return this.companyService.updateCompany(userId, id, updateCompanyDto);
    }

    @Delete(":id")
    @ApiOperation({
        summary: "Delete Company",
        description:
            "Deletes a specific company belonging to the authenticated user.",
    })
    @ApiParam({
        name: "id",
        type: String,
        description: "The ID of the company to delete.",
        example: "cm123456789",
    })
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCompany(
        @CurrentUser("sub") userId: string,
        @Param("id") id: string
    ) {
        return this.companyService.deleteCompany(userId, id);
    }
}
