import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { FeedbackTraineesBatchActivity } from './entities/feedback-trainees-batch-activity.entity';

@Injectable()
export class FeedbackTraineesBatchActivityRepository extends BaseActivityTrackingRepository<FeedbackTraineesBatchActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, FeedbackTraineesBatchActivity);
  }
}
