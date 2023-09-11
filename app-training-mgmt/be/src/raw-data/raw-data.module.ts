import { Module } from '@nestjs/common';
import { RawDataController } from './raw-data.controller';
import { RawDataService } from './raw-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawBatch } from './entities/raw-batch.entity';
import { RawBatchService } from './raw-batch.service';
import { RawBatchRepository } from './raw-batch.repository';
import { RawTrainingDashboard } from './entities/raw-training-dashboard.entity';
import { RawTrainingDashboardService } from './raw-training-dashboard.service';
import { RawTrainingDashboardRepository } from './raw-training-dashboard.repository';
import { JobService } from 'src/Job/job.service';
import { JobRepository } from 'src/Job/job.repository';
import { RawActiveEmployee } from './entities/raw-active-employee.entity';
import { RawResignedEmployee } from './entities/raw-resigned-employee.entity';
import { RawActiveEmployeeService } from './raw-active-employee.service';
import { RawActiveEmployeeRepository } from './raw-active-employee.repository';
import { RawResignedEmployeeRepository } from './raw-resigned-employee.repository';
import { RawResignedEmployeeService } from './raw-resigned-employee.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RawBatch,
      RawTrainingDashboard,
      RawActiveEmployee,
      RawResignedEmployee,
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
  ],
  exports: [
    RawBatchRepository,
    RawBatchService,
    RawTrainingDashboardService,
    RawTrainingDashboardRepository,
    RawDataService,
  ],
})
export class RawDataModule {}
