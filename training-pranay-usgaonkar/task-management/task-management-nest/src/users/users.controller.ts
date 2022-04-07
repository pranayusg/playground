import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTasksDTO } from 'src/tasks/dto/create-tasks.dto';
import { UsersDTO } from './users.dto';

import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({
    description: 'Success',
    type: UsersDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post()
  async createUser(@Body() data: UsersDTO) {
    const user = await this.usersService.create(data);
    return { message: 'User Saved', user };
  }

  @ApiOkResponse({
    description: 'Success',
    type: UsersDTO,
  })
  @ApiNotFoundResponse({ description: 'Users not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get()
  readAllUsers() {
    return this.usersService.getAllUsers();
  }

  @ApiOkResponse({
    description: 'Success',
    type: UsersDTO,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get(':userId')
  getProduct(@Param('userId') userId: string) {
    return this.usersService.read(userId);
  }

  @ApiOkResponse({
    description: 'Success',
    type: UsersDTO,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Patch(':userId')
  async updateUser(
    @Param('userId') userId: string,
    // @Body() data: Partial<UsersDTO>,
    @Body() data: UsersDTO,
  ) {
    await this.usersService.update(userId, data);
    const user = await this.usersService.read(userId);
    return {
      message: 'User updated successfully',
      user,
    };
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.usersService.destroy(userId);
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get(':userId/task')
  async getTasksByUser(@Param('userId') userId: string) {
    return await this.usersService.getTasks(userId);
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post(':userId/task')
  async createTaskForUser(
    @Param('userId') userId: string,
    @Body() task: CreateTasksDTO,
  ) {
    return await this.usersService.createTask(userId, task);
  }
}
