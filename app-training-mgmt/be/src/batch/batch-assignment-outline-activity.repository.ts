import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { BatchAssignmentOutlineActivity } from './entities/batch-assignment-outline-activity.entity';

@Injectable()
export class BatchAssignmentOutlineActivityRepository extends BaseActivityTrackingRepository<BatchAssignmentOutlineActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, BatchAssignmentOutlineActivity);
  }
}
