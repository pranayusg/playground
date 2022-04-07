import { EntityRepository, Repository } from 'typeorm';
import { Task } from './entities/tasks.entity';
import { CreateTasksDTO } from './dto/create-tasks.dto';

@EntityRepository(Task)
export class TasksRepository extends Repository<Task> {
  async createTask(createTaskDto: CreateTasksDTO, userID): Promise<Task> {
    const newTask = this.create({
      ...createTaskDto,
      status: 'new',
      userid: userID,
    });
    await this.save(newTask);
    return newTask;
  }
}
