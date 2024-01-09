import { Module } from '@nestjs/common';
import { NormalizeController } from './normalize.controller';
import { NormalizeService } from './normalize.service';
import { EmployeeModule } from 'src/employee/employee.module';
import { BatchModule } from 'src/batch/batch.module';
import { TrainingDetailModule } from 'src/training-detail/training-detail.module';
import { CertificationModule } from 'src/certification/certification.module';

@Module({
  imports: [
    EmployeeModule,
    BatchModule,
    TrainingDetailModule,
    CertificationModule,
  ],
  controllers: [NormalizeController],
  providers: [NormalizeService],
})
export class NormalizeModule {}
