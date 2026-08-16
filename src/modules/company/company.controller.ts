import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiParam, ApiQuery } from "@nestjs/swagger";

import { CurrentUser } from "@/common/decorators/auth/current-user.decorator";

import { CompanyService } from "./company.service";
import { AddCompanyDto } from "./dto/add-company.dto";

@Controller("company")
export class CompanyController {
    constructor(private readonly companyService: CompanyService) {}

    @Post()
    @ApiOperation({
        summary: "Add Company",
        description: "Creates a new company for the authenticated user.",
    })
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
}
