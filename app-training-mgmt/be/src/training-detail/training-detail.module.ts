import { Module } from '@nestjs/common';
import { TrainingDetailController } from './training-detail.controller';
import { TrainingDetailService } from './training-detail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingDetail } from './entities/training-detail.entity';
import { TrainingDetailRepository } from './training-detail.repository';
import { RawTrainingDashboardRepository } from 'src/raw-data/overall-training/raw-training-dashboard.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { TrainingDetailActivity } from './entities/activity-training-detail.entity';
import { TrainingDetailActivityRepository } from './training-detail-activity.repository';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingDetail, TrainingDetailActivity]),
    BatchModule,
  ],
  controllers: [TrainingDetailController],
  providers: [
    TrainingDetailService,
    TrainingDetailRepository,
    RawTrainingDashboardRepository,
    EmployeeRepository,
    TrainingDetailActivityRepository,
  ],
  exports: [
    TrainingDetailService,
    TrainingDetailRepository,
    RawTrainingDashboardRepository,
    EmployeeRepository,
    TrainingDetailActivityRepository,
  ],
})
export class TrainingDetailModule {}
