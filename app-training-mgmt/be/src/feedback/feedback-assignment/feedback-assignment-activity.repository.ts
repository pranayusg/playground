import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { FeedbackAssignmentActivity } from './entities/feedback-assignment-activity.entity';

@Injectable()
export class FeedbackAssignmentActivityRepository extends BaseActivityTrackingRepository<FeedbackAssignmentActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, FeedbackAssignmentActivity);
  }
}
