import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { AppService } from 'src/app.service';
import { RawTrainingDashboardService } from 'src/raw-data/overall-training/raw-training-dashboard.service';
import { ConfigService } from '@nestjs/config';
import { RawDataModule } from 'src/raw-data/raw-data.module';
import { RawDataService } from 'src/raw-data/raw-data.service';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), RawDataModule],
  providers: [
    JobService,
    RawDataService,
    JobRepository,
    AppService,
    RawTrainingDashboardService,
    ConfigService,
  ],
  controllers: [JobController],
  exports: [JobRepository, JobService, JobModule],
})
export class JobModule {}
