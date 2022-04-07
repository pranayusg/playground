import { Query, UseGuards, ValidationPipe } from '@nestjs/common';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetUser } from 'src/users/get-user.decorator';
import { CreateTasksDTO } from './dto/create-tasks.dto';
import { UpdateTasksDTO } from './dto/update-tasks.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOkResponse({
    description: 'Success',
    type: CreateTasksDTO,
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async createTask(@GetUser() user, @Body() data: CreateTasksDTO) {
    const task = await this.tasksService.createNewTask(data, user.id);

    return { message: 'Task Saved', task };
  }

  @ApiOkResponse({
    description: 'Success',
    type: CreateTasksDTO,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async readAllTasks(@GetUser() user) {
    return await this.tasksService.getAllTasks(user.id);
  }

  @ApiOkResponse({
    description: 'Retrieved task by ID successfully',
    // type: UpdateTasksDTO,
  })
  @ApiNotFoundResponse({ description: 'No task found for ID' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Get(':taskId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async getTask(@GetUser() user, @Param('taskId') taskId: number) {
    return await this.tasksService.readById(taskId, user.id);
  }

  @ApiOkResponse({
    description: 'Success',
    type: CreateTasksDTO,
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Patch(':taskId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async update(
    @GetUser() user,
    @Param('taskId') taskId: number,
    // @Body() updateTasksDto: UpdateTasksDTO,
    @Query('status') status: UpdateTasksDTO,
  ) {
    return this.tasksService.updateTask(taskId, status, user.id);
  }

  @ApiOkResponse({
    description: 'Success',
  })
  @ApiNotFoundResponse({ description: 'Task not found' })
  @ApiInternalServerErrorResponse({
    description: 'Internal server error',
  })
  @Delete(':taskId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async deleteUser(@GetUser() user, @Param('taskId') taskId: number) {
    return await this.tasksService.destroy(taskId, user.id);
  }
}
