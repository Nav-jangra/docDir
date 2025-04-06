import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { QueryPipe } from 'src/common/query.pipe';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(
    @Body() createUserDto: CreateUserDto
  ) {
    createUserDto.password = createUserDto.password || "12345";
    let user = await this.usersService.create(createUserDto)
    return user
  }

  @Get()
  async findAll(
    @Query(new ValidationPipe(), new QueryPipe())
    query: SearchUserDto) {
    let response = await this.usersService.findAll(query)
    return response;
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string) {
    let user = await this.usersService.findOne(+id)
    return user
  }

  @Put(':id')
  async update(@Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {
    let user = await this.usersService.update(+id, updateUserDto)
    return user;
  }
}


