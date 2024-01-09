import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportRepository } from './report.repository';
import { CertificationAchievedService } from 'src/certification/certification-achieved/certification-achieved.service';
import { BatchService } from 'src/batch/batch.service';
import { Helper } from 'src/core/helpers';
import { TrainingDetailService } from 'src/training-detail/training-detail.service';
import { Cron } from '@nestjs/schedule';
import { GENERATE_REPORT_CRON_T } from 'src/core/constant/env.constant';
import { OrderValue } from 'src/core/enum/order.enum';
import { REPORT_PERIODS, StatsTitle } from 'src/core/constant/constatnts';

@Injectable()
export class ReportService {
  private logger = new Logger(ReportService.name);
  constructor(
    private reportRepo: ReportRepository,
    private batchService: BatchService,
    private certificationAchievedService: CertificationAchievedService,
    private helper: Helper,
    private trainingDetailsService: TrainingDetailService,
  ) {}

  async getAll(period: number): Promise<Report> {
    const result = await this.reportRepo.getAll(period);

    return result;
  }

  @Cron(GENERATE_REPORT_CRON_T, { name: 'cron_generate_report' })
  async getDashboardData() {
    try {
      for (const period of REPORT_PERIODS) {
        const existingReport = await this.reportRepo.findOne({
          where: { period },
          order: { createdAt: OrderValue.DESC },
        });
        const requiredDate = this.helper.getDateForMonths(period);

        const noOfOnGoingBatches =
          await this.batchService.getNoOfBatchesForStatus(
            'On Going',
            period,
            requiredDate,
          );
        const noOfCompletedBatches =
          await this.batchService.getNoOfBatchesForStatus(
            'Completed',
            period,
            requiredDate,
          );

        const noOfCertifiedEmployees =
          await this.certificationAchievedService.getCountOfCertificationAchieved(
            period,
            requiredDate,
          );

        const techVsCertifiedEmployees =
          await this.certificationAchievedService.getCountOfEmpForCertification(
            period,
            requiredDate,
          );

        const noOfCandidatedTrained =
          await this.trainingDetailsService.getNoOfTrained(
            period,
            requiredDate,
          );

        const batchVsStrength = await this.batchService.getbatchVsStrength(
          period,
          requiredDate,
        );

        const newValue = {
          stats: [
            {
              title: StatsTitle.OnGoingBatches,
              value: noOfOnGoingBatches.count,
              list: noOfOnGoingBatches.result.map((res, index) => {
                return index === 10
                  ? res
                  : `${res.batchTitle} : ${res.techTopic}`;
              }),
            },
            {
              title: StatsTitle.CompletedBatches,
              value: noOfCompletedBatches.count,
              list: noOfCompletedBatches.result.map((res, index) => {
                return index === 10
                  ? res
                  : `${res.batchTitle} : ${res.techTopic}`;
              }),
            },
            {
              title: StatsTitle.CertifiedEmployees,
              value: noOfCertifiedEmployees.count,
              list: noOfCertifiedEmployees.result.map((res, index) => {
                return index === 10 ? res : res.empId.name;
              }),
            },
            {
              title: StatsTitle.TrainedEmployees,
              value: noOfCandidatedTrained.count,
              list: noOfCandidatedTrained.result.map((res, index) => {
                return index === 10
                  ? res
                  : `${res.empId.name} - ${res.batchId.batchTitle}`;
              }),
            },
          ],
          graph: [{ techVsCertifiedEmployees }, { batchVsStrength }],
        };

        if (existingReport) {
          // If the record exists, update its value object
          await this.reportRepo.updateData(existingReport.id, {
            value: newValue,
          });
        } else {
          // If the record does not exist, create a new one with the new value object
          const newReport = new CreateReportDto();
          newReport.period = period;
          newReport.value = newValue;

          await this.reportRepo.createRecord(newReport);
        }
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${ReportService.name}/getDashboardData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
