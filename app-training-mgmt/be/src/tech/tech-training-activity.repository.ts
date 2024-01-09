import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { TechTrainingActivity } from './entities/tech-training-activity.entity';

@Injectable()
export class TechTrainingActivityRepository extends BaseActivityTrackingRepository<TechTrainingActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, TechTrainingActivity);
  }
}
