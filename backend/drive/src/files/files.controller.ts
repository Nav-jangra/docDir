import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { QueryPipe } from 'src/common/query.pipe';
import { CreateFileDto } from './dtos/create-files';
import { SearchFileDto } from './dtos/search-files';
import { UpdateFileDto } from './dtos/update-files';
import { File } from './entities/files.entity';
import { FilesService } from './files.service';

@Controller('Files')
export class FilesController {
  constructor(private readonly FilesService: FilesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createFileDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const value: CreateFileDto = JSON.parse(createFileDto.body);
    const reponse: File = await this.FilesService.create(
      { file, ...value },
    );
    return reponse;
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe(), new QueryPipe())
    query: SearchFileDto
  ) {
    const response = await this.FilesService.findAll(query);
    return response;
  }

  @Get(':code')
  async findOne(@Param('code') code: string) {
    const File: File = await this.FilesService.findOne(
      code,
    );
    return File;
  }

  @Put(':code')
  async update(
    @Param('code') code: string,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    const File = await this.FilesService.update(
      code,
      updateFileDto,
    );
    return File;
  }
}
