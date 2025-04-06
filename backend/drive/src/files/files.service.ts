import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { error } from 'console';
import { Not, Repository } from 'typeorm';
import { UpdateFileDto } from './dtos/update-files';
import { FilesStatusEnum } from './entities/enums/status.enum';
import { File } from './entities/files.entity';
import { AwsHelper } from './helper/aws.helper';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
    private readonly configService: ConfigService,
    private readonly awsHelper: AwsHelper
  ) { }



  async setData(model: any, entity: File) {
    if (!model.file) {
      throw new BadRequestException('Please Upload a file');
    }
    else {
      try {
        let newName = model.file.originalname;
        newName = newName.trim().replace(/ /g, '-');
        const parts = newName.split('.');
        const name = parts[0];
        const ext = parts.length > 1 ? parts[parts.length - 1] : model.file.mimeType.split('/')[1];
        newName = `${name.replace(/[^A-Z0-9]/gi, '')}-${entity.code}.${ext}`;

        const provider = this.configService.get('storage.providers.awsS3');
        const uploadResponse = await this.awsHelper.upload(provider, model.file, newName);

        entity.size = model.file.size;
        entity.originalName = model.file.originalname;
        entity.mimeType = model.file.mimetype;
        entity.name = uploadResponse.Key;
      }
      catch (err) {
        throw new error('Error in uploading file');
      }
    }
    Object.assign(entity, model);
  }

  async create(
    model: any,
  ): Promise<File> {
    const file: File = new File();
    file.code = this.generateCode('file');
    await this.setData(model, file);
    const fileEntity = this.fileRepository.create(file);
    const response = await this.fileRepository.save(fileEntity);
    return response;
  }

  async findAll(query) {
    query.filters.status = Not(FilesStatusEnum.Inactive)
    const size = await this.fileRepository.count({
      where: query.filters,
    });

    const entities = await this.fileRepository.find({
      where: query.filters,
      skip: query.pagination.offset,
      take: query.pagination.limit,
      order: {
        [query.sorting.sortBy]: query.sorting.order,
      },
    });
    const notFoundEntities = [];

    const responseObject = {
      items: entities,
      count: size,
      offset: query.pagination.offset,
      limit: query.pagination.limit,
    };
    return responseObject;
  }

  async findOne(code: string): Promise<File> {
    const file = await this.fileRepository.findOne({
      where: {
        code,
      },
    });

    if (!file) {
      throw new NotFoundException('Entity not found');
    }
    const provider = this.configService.get('storage.providers.awsS3');
    const response = this.awsHelper.download(provider, file.name);
    file.url = response.url;
    return file;
  }

  async update(
    code: string,
    model: UpdateFileDto,
  ) {
    let file = await this.fileRepository.findOne({
      where: {
        code,
      },
    });
    if (!file) {
      throw new NotFoundException('Entity not found');
    }
    Object.assign(file, model);
    file = await this.fileRepository.save(file);

    return file;
  }

  generateCode(entity: string) {
    const randomNum1 = Math.floor(Math.random() * 99999) + 1;
    const randomNum2 = Math.floor(Math.random() * 99999) + 1;
    const randomNum1Str = randomNum1.toString();
    const randomNum2Str = randomNum2.toString();

    const paddedRandomNum1Str = randomNum1Str.padStart(
      5 - randomNum1Str.length,
      '0',
    );
    const paddedRandomNum2Str = randomNum2Str.padStart(
      5 - randomNum2Str.length,
      '0',
    );

    const randomNumStr = paddedRandomNum1Str + paddedRandomNum2Str;
    return `${entity}:${randomNumStr}`;
  }
}
