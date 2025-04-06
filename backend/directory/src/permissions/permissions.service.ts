import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) { }

  async create(createPermissionDto: CreatePermissionDto) {
    const permission: Permission = new Permission();
    Object.assign(permission, createPermissionDto);
    const permissionEntity = this.permissionRepository.create(permission);
    const response = await this.permissionRepository.save(permissionEntity);
    return response
  }

  async findAll(query: any) {
    if (query.filters.text) {
      query.filters.name = Like(`${query.filters.text}%`)
      delete (query.filters.text);
    }

    let size = await this.permissionRepository.count({
      where: query.filters
    })

    let entities = await this.permissionRepository.find(
      {
        where: query.filters,
        skip: query.pagination.offset,
        take: query.pagination.limit,
        order: {
          [query.sorting.sortBy]: query.sorting.order
        }
      }
    )

    const responseObject = {
      items: entities,
      count: size,
      offset: query.pagination.offset,
      limit: query.pagination.limit,
    };
    return responseObject;
  }

  async findOne(id: number) {
    let permission = await this.permissionRepository.findOne({
      where: {
        id
      }
    })
    if (!permission) throw new NotFoundException('Permission not Found');
    return permission;
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    let permission = await this.findOne(id)
    Object.assign(permission, updatePermissionDto);
    permission = await this.permissionRepository.save(permission)
    return permission
  }
}




