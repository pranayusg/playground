import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { TrainingDetailActivity } from './entities/activity-training-detail.entity';

@Injectable()
export class TrainingDetailActivityRepository extends BaseActivityTrackingRepository<TrainingDetailActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, TrainingDetailActivity);
  }
}
