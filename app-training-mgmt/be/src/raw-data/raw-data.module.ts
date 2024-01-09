import { Module } from '@nestjs/common';
import { RawDataController } from './raw-data.controller';
import { RawDataService } from './raw-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawBatch } from './overall-training/entities/raw-batch.entity';
import { RawBatchService } from './overall-training/raw-batch.service';
import { RawBatchRepository } from './overall-training/raw-batch.repository';
import { RawTrainingDashboard } from './overall-training/entities/raw-training-dashboard.entity';
import { RawTrainingDashboardService } from './overall-training/raw-training-dashboard.service';
import { RawTrainingDashboardRepository } from './overall-training/raw-training-dashboard.repository';
import { JobService } from 'src/Job/job.service';
import { JobRepository } from 'src/Job/job.repository';
import { RawActiveEmployee } from './employee-master/entities/raw-active-employee.entity';
import { RawResignedEmployee } from './employee-master/entities/raw-resigned-employee.entity';
import { RawActiveEmployeeService } from './employee-master/raw-active-employee.service';
import { RawActiveEmployeeRepository } from './employee-master/raw-active-employee.repository';
import { RawResignedEmployeeRepository } from './employee-master/raw-resigned-employee.repository';
import { RawResignedEmployeeService } from './employee-master/raw-resigned-employee.service';
import { Helper } from 'src/core/helpers';
import { RawAchievedRepository } from './certification/raw-achieved.repository';
import { RawAchieved } from './certification/entities/raw-achieved.entity';
import { RawOngoing } from './certification/entities/raw-ongoing.entity';
import { RawApprovedCertification } from './certification/entities/raw-approved-certification.entity';
import { RawApprovedCertificationRepository } from './certification/raw-approved-certification.repository';
import { RawApprovedCertificationService } from './certification/raw-approved-certification.service';
import { RawAchievedService } from './certification/raw-achieved.service';
import { RawOnGoingRepository } from './certification/raw-on-going.repository';
import { RawOnGoingService } from './certification/raw-on-going.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RawBatch,
      RawTrainingDashboard,
      RawActiveEmployee,
      RawResignedEmployee,
      RawAchieved,
      RawOngoing,
      RawApprovedCertification,
    ]),
  ],
  controllers: [RawDataController],
  providers: [
    RawDataService,
    RawBatchService,
    RawBatchRepository,
    RawTrainingDashboardService,
    RawTrainingDashboardRepository,
    JobService,
    JobRepository,
    RawActiveEmployeeService,
    RawActiveEmployeeRepository,
    RawResignedEmployeeRepository,
    RawResignedEmployeeService,
    Helper,
    RawAchievedRepository,
    RawAchievedService,
    RawApprovedCertificationRepository,
    RawApprovedCertificationService,
    RawOnGoingRepository,
    RawOnGoingService,
  ],
  exports: [
    RawBatchRepository,
    RawBatchService,
    RawTrainingDashboardService,
    RawTrainingDashboardRepository,
    RawDataService,
    RawActiveEmployeeService,
    RawActiveEmployeeRepository,
    RawResignedEmployeeRepository,
    RawResignedEmployeeService,
    Helper,
    RawAchievedRepository,
    RawAchievedService,
    RawApprovedCertificationRepository,
    RawApprovedCertificationService,
    RawOnGoingRepository,
    RawOnGoingService,
  ],
})
export class RawDataModule {}
