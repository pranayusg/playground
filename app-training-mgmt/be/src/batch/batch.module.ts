import { Module } from '@nestjs/common';
import { BatchController } from './batch.controller';
import { BatchService } from './batch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batch } from './entities/batch.entity';
import { BatchRepository } from './batch.repository';
import { RawBatchRepository } from 'src/raw-data/overall-training/raw-batch.repository';
import { BatchAssignmentOutlineService } from 'src/batch/batch-assignment-outline.service';
import { BatchAssignmentOutlineRepository } from 'src/batch/batch-assignment-outline.repository';
import { BatchAssignmentOutline } from 'src/batch/entities/batch-assignment-outline.entity';
import { BatchActivity } from './entities/batch-activity.entity';
import { BatchAssignmentOutlineActivity } from './entities/batch-assignment-outline-activity.entity';
import { BatchActivityRepository } from './batch-activity.repository';
import { BatchAssignmentOutlineActivityRepository } from './batch-assignment-outline-activity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Batch,
      BatchAssignmentOutline,
      BatchActivity,
      BatchAssignmentOutlineActivity,
    ]),
  ],
  controllers: [BatchController],
  providers: [
    BatchService,
    BatchRepository,
    RawBatchRepository,
    BatchAssignmentOutlineService,
    BatchAssignmentOutlineRepository,
    BatchActivityRepository,
    BatchAssignmentOutlineActivityRepository,
  ],
  exports: [
    BatchService,
    BatchRepository,
    RawBatchRepository,
    BatchAssignmentOutlineService,
    BatchAssignmentOutlineRepository,
    BatchActivityRepository,
    BatchAssignmentOutlineActivityRepository,
  ],
})
export class BatchModule {}
