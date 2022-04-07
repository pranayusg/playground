import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './users.entity';
import { UsersDTO } from './users.dto';
import * as bcrypt from 'bcrypt';
import { CreateTasksDTO } from 'src/tasks/dto/create-tasks.dto';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class UsersService {
  private saltOrRounds = 10;
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly tasksService: TasksService,
  ) {}

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async create(data: UsersDTO) {
    data.password = await bcrypt.hash(data.password, this.saltOrRounds);
    const user = await this.usersRepository.create(data);
    await this.usersRepository.save(data);
    return user;
  }

  async read(id: string) {
    return await this.usersRepository.findOne({ where: { id: id } });
  }

  async readEmail(email: string) {
    return await this.usersRepository.findOne({ where: { email: email } });
  }

  async update(id: string, data: Partial<UsersDTO>) {
    const existingUser = await this.usersRepository.findOne({ id });
    if (!existingUser) {
      throw new NotFoundException(
        `User with Id:${id} is not found in the database`,
      );
    }

    if (data.password)
      data.password = await bcrypt.hash(data.password, this.saltOrRounds);

    await this.usersRepository.update({ id }, data);
    return await this.usersRepository.findOne({ id });
  }

  async destroy(id: string) {
    const result = await this.usersRepository.delete({ id });
    if (result.affected) return { deleted: true };

    return { deleted: false };
  }

  async getTasks(id: string) {
    const existingUser = await this.usersRepository.findOne({ id });
    if (!existingUser) {
      throw new NotFoundException(
        `User with Id:${id} not found in the database`,
      );
    }

    return await this.tasksService.getAllTasks(id);
  }

  async createTask(id: string, task: CreateTasksDTO) {
    const existingUser = await this.usersRepository.findOne({ id });
    if (!existingUser) {
      throw new NotFoundException(
        `User with Id:${id} not found in the database`,
      );
    }

    return await this.tasksService.createNewTask(task, id);
  }
}
