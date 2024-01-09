import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CertificationApprovedService } from 'src/certification/certification-approved/certification-approved.service';
import { BatchService } from 'src/batch/batch.service';
import { CertificationAchievedService } from 'src/certification/certification-achieved/certification-achieved.service';
import { NORMALIZE_CRON_T } from 'src/core/constant/env.constant';
import { EmployeeService } from 'src/employee/employee.service';
import { TrainingDetailService } from 'src/training-detail/training-detail.service';
import { DataSource } from 'typeorm';
import { LOCK_FAILED_MESSAGE } from 'src/core/constant/constatnts';

@Injectable()
export class NormalizeService {
  private logger = new Logger(NormalizeService.name);
  constructor(
    private dataSource: DataSource,
    private employeeService: EmployeeService,
    private batchService: BatchService,
    private trainingDetailService: TrainingDetailService,
    private certificationApprovedSevice: CertificationApprovedService,
    private certificationAchievedService: CertificationAchievedService,
  ) {}

  @Cron(NORMALIZE_CRON_T, { name: 'cron_normalize' })
  async transfer() {
    const connection = this.dataSource.createQueryBuilder().connection;

    const lockId = 1; // Replace with a unique integer identifier for your lock

    while (true) {
      // Try to acquire the advisory lock
      const lockResult = await connection.query(
        `SELECT pg_try_advisory_lock(${lockId})`,
      );

      if (lockResult[0].pg_try_advisory_lock) {
        await connection.query(`SELECT pg_advisory_lock(${lockId})`);
        try {
          await this.employeeService.transferFromRawTable();
          await this.batchService.transferRawData();
          await this.trainingDetailService.transferRawData();
          await this.certificationApprovedSevice.transferRawData();
          await this.certificationAchievedService.transferRawData();

          await connection.query(`COMMIT`);
        } catch (err) {
          this.logger.error(
            err.message,
            err.stack,
            `${NormalizeService.name}/transfer`,
          );
          throw new InternalServerErrorException(err.message);
        } finally {
          await connection.query(`SELECT pg_advisory_unlock(${lockId})`);
          break;
        }
      } else {
        this.logger.log(LOCK_FAILED_MESSAGE);
      }
    }
  }
}
