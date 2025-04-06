import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Apis } from 'src/apis/entity/apis.entity';
import { Repository } from 'typeorm';
import { ApisCreationDto } from './dtos/apisCreation.dto';
import { ApisUpdationDto } from './dtos/apisUpdation.dto';
import { StatusEnum } from './entity/enums/status';


@Injectable()
export class ApiService {
  constructor(
    @InjectRepository(Apis) private apisRepository: Repository<Apis>,
  ) { }

  set = (entity: Apis, model: Partial<ApisCreationDto>) => {
    entity.permissions = model.permissions || entity.permissions || ''

    if (model.status) {
      entity.status = model.status
    }
    if (model.access) {
      entity.access = model.access
    }
  }

  async create(model: ApisCreationDto): Promise<Apis> {
    let path = await this.apisRepository.findOneBy(
      {
        method: model.method,
        service: model.service,
        entity: model.entity,
        path: model.path
      });

    if (!path) {
      path = this.apisRepository.create({
        method: model.method,
        service: model.service,
        entity: model.entity,
        path: model.path || ''
      })
    }

    this.set(path, model)
    path = await this.apisRepository.save(path)
    return path
  }

  async get(id: number): Promise<Apis> {
    let path = await this.apisRepository.findOneBy({ id })
    if (!path) {
      throw new NotFoundException("Requested Entity not Found");
    }
    return path
  }

  async update(id: number, model: ApisUpdationDto): Promise<Apis> {
    let path = await this.get(id);
    this.set(path, model)
    path = await this.apisRepository.save(path)
    return path
  }

  async findAll(query: any) {
    let where = {};

    const offset = query.pagination.offset;
    const limit = query.pagination.limit;
    const sortBy = query.sorting.sortBy
    const order = query.sorting.order
    const size = await this.apisRepository.count({
      where: query.filters,
    });
    if (query.filters.status) {
      where['status'] = query.filters.status == 'active' ? StatusEnum.Active : StatusEnum.inactive
    }
    if (query.filters.service) {
      where['service'] = query.service;
    }
    let paths

    if (size >= offset) {
      paths = await this.apisRepository.find({
        where: where,
        skip: offset,
        take: limit,
        order: {
          [sortBy]: order,
        },
      });
    }
    const responseObject = {
      items: paths,
      count: size,
      offset: offset,
      limit: limit,
    };
    return responseObject;
  }

  responseMapper(entity: any) {
    return {
      status: entity ? 200 : 503,
      data: entity ? entity : { message: 'Service Unavailable' }
    }
  }
}