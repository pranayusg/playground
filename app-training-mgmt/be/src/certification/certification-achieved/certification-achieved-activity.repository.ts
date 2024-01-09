import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { CertificationAchievedActivity } from './entities/certification-achieved-activity.entity';

@Injectable()
export class CertificationAchievedActivityRepository extends BaseActivityTrackingRepository<CertificationAchievedActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, CertificationAchievedActivity);
  }
}
