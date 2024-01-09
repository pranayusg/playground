import { Module } from '@nestjs/common';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';
import { ReportRepository } from './report.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { BatchModule } from 'src/batch/batch.module';
import { Helper } from 'src/core/helpers';
import { TrainingDetailModule } from 'src/training-detail/training-detail.module';
import { CertificationModule } from 'src/certification/certification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    BatchModule,
    CertificationModule,
    TrainingDetailModule,
  ],
  controllers: [ReportController],
  providers: [ReportService, ReportRepository, Helper],
})
export class ReportModule {}
