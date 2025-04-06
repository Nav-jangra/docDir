import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Like, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) { }


  setData = async (entity: User, model: any) => {
    if (model.role) {
      let role = await this.roleRepository.findOne({
        where: {
          id: model.role.id
        }
      })
      if (!role) {
        throw new BadRequestException("invalid Data")
      }
      entity.role = role
      delete model.role
    }
    Object.assign(entity, model);
  }

  async create(
    createUserDto: CreateUserDto): Promise<User> {
    const user: User = new User();
    createUserDto.password = createUserDto.password
    await this.setData(user, createUserDto);
    const userEntity = this.userRepository.create(user);
    const response = await this.userRepository.save(userEntity);
    return response
  }

  async findAll(query: any) {
    if (query.filters.role) {
      query.filters.role = { code: query.filters.role }
    }

    if (query.filters.text) {
      query.filters.name = Like(`${query.filters.text}%`)
      delete (query.filters.text)
    }

    let size = await this.userRepository.count({
      where: query.filters
    })

    let entities = await this.userRepository.find(
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
    let user = await this.userRepository.findOne({
      where: {
        id
      },
      relations: {
        role: true,
      }
    })
    if (!user) throw new NotFoundException('User not Found');
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    let entity = await this.findOne(id)
    await this.setData(entity, updateUserDto)
    entity = await this.userRepository.save(entity)
    return entity
  }
}
