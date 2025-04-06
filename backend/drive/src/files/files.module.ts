import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { value } from '../config/value';
import { File } from './entities/files.entity';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { AwsHelper } from './helper/aws.helper';

@Module({
  imports: [TypeOrmModule.forFeature([File]),
  ConfigModule.forRoot({
    load: [() => value],
  })],
  controllers: [FilesController],
  providers: [FilesService, AwsHelper],
  exports: [FilesService],
})
export class FilesModule { }
