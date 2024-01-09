import { Module } from '@nestjs/common';
import { CertificationController } from './certification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CertificationAchieved } from './certification-achieved/entities/certification-achieved.entity';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { RawAchievedRepository } from 'src/raw-data/certification/raw-achieved.repository';
import { CertificationAchievedRepository } from './certification-achieved/certification-achieved.repository';
import { CertificationAchievedService } from './certification-achieved/certification-achieved.service';
import { CertificationApprovedRepository } from './certification-approved/certification-approved.repository';
import { RawApprovedCertificationRepository } from 'src/raw-data/certification/raw-approved-certification.repository';
import { CertificationApprovedService } from './certification-approved/certification-approved.service';
import { CertificationApproved } from './certification-approved/entities/certification-approved.entity';
import { CertificationOngoingRepository } from './certification-ongoing/certification-ongoing.repository';
import { CertificationOngoingService } from './certification-ongoing/certification-ongoing.service';
import { CertificationOngoing } from './certification-ongoing/entities/certification-ongoing.entity';
import { CertificationAchievedActivity } from './certification-achieved/entities/certification-achieved-activity.entity';
import { CertificationApprovedActivity } from './certification-approved/entities/certification-approved-activity.entity';
import { CertificationOngoingActivity } from './certification-ongoing/entities/certification-ongoing-activity.entity';
import { CertificationAchievedActivityRepository } from './certification-achieved/certification-achieved-activity.repository';
import { CertificationApprovedActivityRepository } from './certification-approved/certification-approved-activity.repository';
import { CertificationOngoingActivityRepository } from './certification-ongoing/certification-ongoing-activity.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CertificationAchieved,
      CertificationApproved,
      CertificationOngoing,
      CertificationAchievedActivity,
      CertificationApprovedActivity,
      CertificationOngoingActivity,
    ]),
  ],
  providers: [
    CertificationAchievedService,
    CertificationAchievedRepository,
    RawAchievedRepository,
    EmployeeRepository,
    CertificationApprovedRepository,
    CertificationApprovedService,
    RawApprovedCertificationRepository,
    CertificationOngoingService,
    CertificationOngoingRepository,
    CertificationAchievedActivityRepository,
    CertificationApprovedActivityRepository,
    CertificationOngoingActivityRepository,
  ],
  controllers: [CertificationController],
  exports: [
    CertificationAchievedService,
    CertificationAchievedRepository,
    RawAchievedRepository,
    EmployeeRepository,
    CertificationApprovedRepository,
    CertificationApprovedService,
    RawApprovedCertificationRepository,
    CertificationAchievedActivityRepository,
    CertificationApprovedActivityRepository,
    CertificationOngoingActivityRepository,
  ],
})
export class CertificationModule {}
