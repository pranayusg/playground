import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { BatchActivity } from './entities/batch-activity.entity';

@Injectable()
export class BatchActivityRepository extends BaseActivityTrackingRepository<BatchActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, BatchActivity);
  }
}
