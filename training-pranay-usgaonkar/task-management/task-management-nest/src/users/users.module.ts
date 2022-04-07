import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { TasksRepository } from 'src/tasks/tasks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, TasksRepository])],
  controllers: [UsersController],
  providers: [UsersService, TasksService],
})
export class UsersModule {}
