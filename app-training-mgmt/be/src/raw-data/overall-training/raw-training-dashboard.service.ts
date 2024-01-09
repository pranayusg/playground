import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawTrainingDashboardRepository } from './raw-training-dashboard.repository';
import { TrainingDashDto } from './dto/training-dash.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { Helper } from 'src/core/helpers';

@Injectable()
export class RawTrainingDashboardService {
  private logger = new Logger(RawTrainingDashboardService.name);
  constructor(
    private trainingDashRepo: RawTrainingDashboardRepository,
    private datesHelper: Helper,
  ) {}

  getAll(
    page: number,
    noOfRecords: number,
    name: string,
    orderBy: string,
    order: string,
  ): Promise<PaginatedResponse> {
    return this.trainingDashRepo.getAll(
      page,
      noOfRecords,
      name,
      orderBy,
      order,
    );
  }

  async insertOrUpdateTrainingDash(
    newData: TrainingDashDto[],
  ): Promise<object> {
    try {
      let rowsInserted = 0;
      let rowsUpdated = 0;
      let rowsRejected = 0;
      const rejectedRows = [];

      for (const newRow of newData) {
        const {
          empId,
          doj,
          name,
          trainingStartDate,
          trainingEndDate,
          trainer,
          batchStatus,
          resourceType,
          typeOfTraining,
          batchType,
        } = newRow;

        if (
          typeof trainingStartDate === 'undefined' ||
          typeof trainingStartDate === 'string'
        ) {
          newRow.trainingStartDate = null;
        } else {
          const formatedTrainingStartDate: Date =
            this.datesHelper.changeDateFormat(trainingStartDate);
          newRow.trainingStartDate = formatedTrainingStartDate;
        }

        if (
          typeof trainingEndDate === 'undefined' ||
          typeof trainingEndDate === 'string'
        ) {
          newRow.trainingEndDate = null;
        } else {
          const formatedTrainingEndDate: Date =
            this.datesHelper.changeDateFormat(trainingEndDate);
          newRow.trainingEndDate = formatedTrainingEndDate;
        }

        if (typeof doj === 'undefined' || typeof doj === 'string') {
          newRow.doj = null;
        } else {
          const formatedDoj: Date = this.datesHelper.changeDateFormat(doj);
          newRow.doj = formatedDoj;
        }

        if (!name || !doj || !empId || !typeOfTraining || !batchType) {
          rowsRejected++;
          rejectedRows.push({
            row: {
              ...newRow,
              trainingStartDate: this.datesHelper.convertToDDMMMYY(
                newRow.trainingStartDate,
              ),
              trainingEndDate: this.datesHelper.convertToDDMMMYY(
                newRow.trainingEndDate,
              ),
              doj: this.datesHelper.convertToDDMMMYY(newRow.doj),
            },
            reason: 'Missing: Name/ DOJ/ Emp ID/ Type of Training/ Batch Type',
          });
          continue;
        }

        if (typeof trainer === 'undefined') {
          newRow.trainer = null;
        }

        if (typeof batchStatus === 'undefined') {
          newRow.batchStatus = null;
        }

        if (typeof resourceType === 'undefined') {
          newRow.resourceType = null;
        }

        newRow.batchType = this.formatText(newRow.batchType);
        newRow.batchTypeDescription = this.formatText(
          newRow.batchTypeDescription,
        );

        const conditions = {
          empId: newRow.empId,
          name: newRow.name,
          typeOfTraining: newRow.typeOfTraining,
          batchType: newRow.batchType,
          batchTypeDescription: newRow.batchTypeDescription,
        };

        const existingRow: any[] = await this.trainingDashRepo.findExisting(
          conditions,
        );

        if (existingRow.length !== 0) {
          if (this.isDifferent(existingRow, newRow)) {
            await this.trainingDashRepo.updateData(existingRow[0], {
              ...newRow,
              isProcessed: false,
            });
            rowsUpdated++;
          } else {
            rowsRejected++;
            continue;
          }
        } else {
          // Insert new row into the main table
          await this.trainingDashRepo.createNewEntry(newRow);
          rowsInserted++;
        }
      }
      return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawTrainingDashboardService.name}/insertOrUpdateTrainingDash`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  isDifferent(existing: any[], incoming: any): boolean {
    return (
      existing[0].trainer !== incoming.trainer ||
      existing[0].name !== incoming.name ||
      existing[0].designation !== incoming.designation ||
      existing[0].reportingManager !== incoming.reportingManager ||
      existing[0].clientDirector !== incoming.clientDirector ||
      existing[0].clientName !== incoming.clientName ||
      existing[0].resourceType !== incoming.resourceType ||
      this.datesHelper.convertToUnixTimestamp(existing[0].doj) !=
        this.datesHelper.convertToUnixTimestamp(incoming.doj) ||
      this.datesHelper.convertToUnixTimestamp(existing[0].trainingStartDate) !=
        this.datesHelper.convertToUnixTimestamp(incoming.trainingStartDate) ||
      this.datesHelper.convertToUnixTimestamp(existing[0].trainingEndDate) !=
        this.datesHelper.convertToUnixTimestamp(incoming.trainingEndDate) ||
      existing[0].batchStatus !== incoming.batchStatus ||
      existing[0].employeeStatus !== incoming.employeeStatus
    );
  }

  formatText(text: string) {
    // Remove whitespace before a colon
    let result = text.replace(/\s*:/g, ':');

    // Remove double spaces
    result = result.replace(/\s{2,}/g, ' ');

    return result.trimEnd();
  }
}
