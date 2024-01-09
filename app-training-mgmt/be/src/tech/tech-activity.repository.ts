import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { TechActivity } from './entities/tech-activity.entity';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';

@Injectable()
export class TechActivityRepository extends BaseActivityTrackingRepository<TechActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, TechActivity);
  }
}
