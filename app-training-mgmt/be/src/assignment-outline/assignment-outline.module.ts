import { Module } from '@nestjs/common';
import { AssignmentOutlineController } from './assignment-outline.controller';
import { AssignmentOutlineService } from './assignment-outline.service';
import { AssignmentOutline } from './entities/assignment-outline.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssignmentOutlineRepository } from './assignment-outline.repository';
import { AssignmentOutlineActivity } from './entities/assignment-outline-activity.entity';
import { AssignmentOutlineActivityRepository } from './assignment-outline-activity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AssignmentOutline, AssignmentOutlineActivity]),
  ],
  controllers: [AssignmentOutlineController],
  providers: [
    AssignmentOutlineService,
    AssignmentOutlineRepository,
    AssignmentOutlineActivityRepository,
  ],
})
export class AssignmentOutlineModule {}
