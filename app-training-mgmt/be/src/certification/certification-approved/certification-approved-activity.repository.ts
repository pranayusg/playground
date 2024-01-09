import { Injectable } from '@nestjs/common';
import { BaseActivityTrackingRepository } from 'src/core/repository/activity.repository';
import { EntityManager } from 'typeorm';
import { CertificationApprovedActivity } from './entities/certification-approved-activity.entity';

@Injectable()
export class CertificationApprovedActivityRepository extends BaseActivityTrackingRepository<CertificationApprovedActivity> {
  constructor(private readonly manager: EntityManager) {
    super(manager, CertificationApprovedActivity);
  }
}
