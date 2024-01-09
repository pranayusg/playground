import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { CertificationOngoingActivity } from './entities/certification-ongoing-activity.entity';

@Injectable()
export class CertificationOngoingActivityRepository extends BaseActivityTrackingRepository<CertificationOngoingActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, CertificationOngoingActivity);
  }
}
