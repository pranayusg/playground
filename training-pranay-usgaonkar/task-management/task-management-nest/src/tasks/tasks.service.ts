import { Connection, getConnection, getCustomRepository } from 'typeorm';
import { TasksRepository } from './tasks.repository';
import { CreateTasksDTO } from './dto/create-tasks.dto';
import { UpdateTasksDTO } from './dto/update-tasks.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/tasks.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository) private tasksRepository: TasksRepository,
  ) {}

  async getAllTasks(userID) {
    const task = await this.tasksRepository.find({
      where: [{ userid: userID }],
    });

    if (!task) {
      throw new NotFoundException(
        `Tasks not found for the current user in the database`,
      );
    }

    return task;
  }

  async createNewTask(data: CreateTasksDTO, userID) {
    return await this.tasksRepository.createTask(data, userID);
  }

  async readById(id: number, userID): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id: id, userid: userID },
    });

    if (!task) {
      throw new NotFoundException(
        `Task with Id:${id} is not found in the database`,
      );
    }

    return task;
  }

  async updateTask(id: number, newStatus, userID): Promise<Task> {
    const existingTask = await this.tasksRepository.findOne({
      where: { id, userid: userID },
    });
    if (!existingTask) {
      throw new NotFoundException(
        `Task with Id:${id} is not found in the database`,
      );
    }
    // const { title, description, status } = updateTasksDto;
    // existingTask.title = title;
    // existingTask.description = description;
    existingTask.status = newStatus;
    await this.tasksRepository.save(existingTask);
    return existingTask;
  }

  async destroy(id: number, userID) {
    const existingTask = await this.tasksRepository.findOne({
      where: { id, userid: userID },
    });
    if (!existingTask) {
      throw new NotFoundException(
        `Task with Id:${id} is not found in the database`,
      );
    }
    const result = await this.tasksRepository.delete({ id, userid: userID });
    if (result.affected) return { deleted: true };

    return { deleted: false };
  }
}
