import { Injectable } from '@nestjs/common';
import { RawTrainingDashboardRepository } from './raw-training-dashboard.repository';
import { TrainingDashDto } from './dto/training-dash.dto';
import { PaginatedResponse } from 'src/core/pagination.interface';
import { RawTrainingDashboard } from './entities/raw-training-dashboard.entity';

@Injectable()
export class RawTrainingDashboardService {
  constructor(private trainingDashRepo: RawTrainingDashboardRepository) {}

  getAll(
    page: number,
    noOfRecords: number,
    name: string,
    orderBy: string,
  ): Promise<PaginatedResponse | RawTrainingDashboard[]> {
    return this.trainingDashRepo.getAll(page, noOfRecords, name, orderBy);
  }

  async insertOrUpdateTrainingDash(
    newData: TrainingDashDto[],
  ): Promise<object> {
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
          this.changeDateFormat(trainingStartDate);
        newRow.trainingStartDate = formatedTrainingStartDate;
      }

      if (
        typeof trainingEndDate === 'undefined' ||
        typeof trainingEndDate === 'string'
      ) {
        newRow.trainingEndDate = null;
      } else {
        const formatedTrainingEndDate: Date =
          this.changeDateFormat(trainingEndDate);
        newRow.trainingEndDate = formatedTrainingEndDate;
      }

      if (!name || !doj || !empId || !typeOfTraining || !batchType) {
        rowsRejected++;
        rejectedRows.push({
          row: {
            ...newRow,
            trainingStartDate: this.convertToDDMMMYY(newRow.trainingStartDate),
            trainingEndDate: this.convertToDDMMMYY(newRow.trainingEndDate),
          },
          reason: 'Missing: Name/ DOJ/ Emp ID/ Type of Training/ Batch Type',
        });
        continue;
      }

      if (typeof doj === 'string' || typeof resourceType === 'number') {
        rowsRejected++;
        rejectedRows.push({
          row: {
            ...newRow,
            trainingStartDate: this.convertToDDMMMYY(newRow.trainingStartDate),
            trainingEndDate: this.convertToDDMMMYY(newRow.trainingEndDate),
          },
          reason: 'Invalid: DOJ/ resourceType',
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

      const formatedDoj: Date = this.changeDateFormat(doj);
      newRow.doj = formatedDoj;

      const conditions = {
        empId: newRow.empId,
        doj: newRow.doj,
        typeOfTraining: newRow.typeOfTraining,
        batchType: newRow.batchType,
        batchTypeDescription: newRow.batchTypeDescription,
      };

      const existingRow: any[] = await this.trainingDashRepo.findExisting(
        conditions,
      );

      if (existingRow.length !== 0) {
        //console.log(existingRow[0], newRow)
        if (this.isDifferent(existingRow, newRow)) {
          this.trainingDashRepo.update(existingRow[0], newRow);
          rowsUpdated++;
        } else {
          rowsRejected++;
          continue;
        }
      } else {
        // Insert new row into the main table
        this.trainingDashRepo.createNewEntry(newRow);
        rowsInserted++;
      }
    }
    return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
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
      this.convertToUnixTimestamp(existing[0].trainingStartDate) !=
        this.convertToUnixTimestamp(incoming.trainingStartDate) ||
      this.convertToUnixTimestamp(existing[0].trainingEndDate) !=
        this.convertToUnixTimestamp(incoming.trainingEndDate) ||
      existing[0].batchStatus !== incoming.batchStatus ||
      existing[0].employeeStatus !== incoming.employeeStatus
    );
  }

  changeDateFormat(NewRowsdate: any): Date {
    const newDate: Date = new Date((NewRowsdate - 25569) * 86400 * 1000);
    return newDate;
  }

  convertToUnixTimestamp(timestamp: Date): number {
    const dateObject = new Date(timestamp);
    const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
    const millisecondsSinceEpoch = dateObject.getTime();
    return unixTimestamp;
  }

  convertToDDMMMYY(dateObject: Date) {
    if (!dateObject) {
      return null;
    }
    const day = dateObject.getUTCDate();
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const year = dateObject.getUTCFullYear().toString().substr(-2);

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
}
