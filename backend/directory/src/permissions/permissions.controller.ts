import { Body, Controller, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { QueryPipe } from 'src/common/query.pipe';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { SearchPermissionDto } from './dto/search-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  async create(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.permissionsService.create(createPermissionDto);
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe(), new QueryPipe())
    query: SearchPermissionDto) {
    return await this.permissionsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return await this.permissionsService.update(+id, updatePermissionDto);
  }
}
