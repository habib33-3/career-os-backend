import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";

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
}
