import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from 'src/permissions/entities/permission.entity';
import { In, Like, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) { }

  setData = async (entity: Role, model: any) => {
    if (model.permissions.length > 0) {
      let permissions = await this.permissionRepository.find({
        where: {
          id: In(model.permissions)
        }
      })
      if (permissions.length !== model.permissions.length) {
        throw new BadRequestException("invalid Data")
      }
      entity.permissions = permissions
      delete model.permissions
    }
    else {
      throw new BadRequestException('Please provide permissions')
    }
    Object.assign(entity, model);
  }

  async create(
    createRoleDto: CreateRoleDto): Promise<Role> {
    const role: Role = new Role();
    await this.setData(role, createRoleDto);
    const roleEntity = this.roleRepository.create(role);
    const response = await this.roleRepository.save(roleEntity);
    return response
  }

  async findAll(query: any) {
    if (query.filters.text) {
      query.filters.name = Like(`${query.filters.text}%`)
      delete (query.filters.text);
    }

    let size = await this.roleRepository.count({
      where: query.filters
    })

    let entities = await this.roleRepository.find(
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
    let role = await this.roleRepository.findOne({
      where: {
        id
      },
      relations: {
        permissions: true,
      }
    })
    if (!role) throw new NotFoundException('Role not Found');
    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    let entity = await this.findOne(id)
    await this.setData(entity, updateRoleDto)
    entity = await this.roleRepository.save(entity)
    return entity
  }

}




