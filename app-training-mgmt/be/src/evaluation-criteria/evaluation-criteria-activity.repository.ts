import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { EvaluationCriteriaActivity } from './entities/evaluation-criteria-activity.entity';

@Injectable()
export class EvaluationCriteriaActivityRepository extends BaseActivityTrackingRepository<EvaluationCriteriaActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, EvaluationCriteriaActivity);
  }
}
