import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiService } from './apis.service';
import { ApisCreationDto } from './dtos/apisCreation.dto';
import { ApisSearchDto } from './dtos/apisSearch.dto';
import { ApisUpdationDto } from './dtos/apisUpdation.dto';
import { QueryPipe } from './pipes/query.pipe';

@Controller("/api/gateway/apis")
export class apisController {
    constructor(
        private readonly apiService: ApiService
    ) { }

    @Post()
    async create(@Body() body: ApisCreationDto) {
        const response = await this.apiService.create(body);
        return this.apiService.responseMapper(response);
    }

    @Get("/:id")
    async get(@Param("id") id: number) {
        const response = await this.apiService.get(id);
        return this.apiService.responseMapper(response);
    }

    @Post("/:id/update")
    async Update(@Param("id") id: number, @Body() body: ApisUpdationDto) {
        const response = await this.apiService.update(id, body);
        return this.apiService.responseMapper(response);;
    }

    @Get()
    async findAll(
        @Query(new QueryPipe()) query: ApisSearchDto,) {
        const response = await this.apiService.findAll(query);
        return this.apiService.responseMapper(response);;
    }
}