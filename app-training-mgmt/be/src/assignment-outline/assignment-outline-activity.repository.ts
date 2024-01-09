import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { AssignmentOutlineActivity } from './entities/assignment-outline-activity.entity';

@Injectable()
export class AssignmentOutlineActivityRepository extends BaseActivityTrackingRepository<AssignmentOutlineActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, AssignmentOutlineActivity);
  }
}
