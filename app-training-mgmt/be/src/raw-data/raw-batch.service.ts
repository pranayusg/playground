import { Injectable } from '@nestjs/common';
import { RawBatch } from './entities/raw-batch.entity';
import { RawBatchRepository } from './raw-batch.repository';
import { BatchesDto } from './dto/createBatches.dto';
import { PaginatedResponse } from 'src/core/pagination.interface';

@Injectable()
export class RawBatchService {
  constructor(private batchesRepo: RawBatchRepository) {}

  getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    status: string,
    tech: string,
  ): Promise<PaginatedResponse | RawBatch[]> {
    return this.batchesRepo.getAll(pageNo, noOfRecords, orderBy, status, tech);
  }

  getTech() {
    return this.batchesRepo.getTech();
  }

  async insertOrUpdateBatches(newData: BatchesDto[]): Promise<object> {
    let rowsInserted = 0;
    let rowsUpdated = 0;
    let rowsRejected = 0;
    const rejectedRows = [];
    let formatedStartDate: Date;

    for (const newRow of newData) {
      const {
        batchTitle,
        tech,
        startDate,
        trainingCoordinator,
        headTrainer,
        endDate,
        NoSuccess,
        NoFailed,
      } = newRow;

      if (typeof startDate === 'number') {
        formatedStartDate = this.changeDateFormat(startDate);
        newRow.startDate = formatedStartDate;
      }
      if (endDate === undefined) {
        newRow.endDate = null;
      } else {
        const formatedEndDate: Date = this.changeDateFormat(endDate);
        newRow.endDate = formatedEndDate;
      }

      if (
        typeof newRow.NoSuccess === 'string' ||
        typeof newRow.NoFailed === 'string' ||
        typeof newRow.startDate === 'string' ||
        typeof newRow.endDate === 'string'
      ) {
        rejectedRows.push({
          row: {
            ...newRow,
            startDate: this.convertToDDMMMYY(newRow.startDate),
            endDate: this.convertToDDMMMYY(newRow.endDate),
          },
          reason: 'Invalid Data: No Success/ No Failed/ Start Date/ End Date',
        });
        rowsRejected++;
        continue;
      }

      if (typeof newRow.startDate === 'string') {
        rejectedRows.push({
          row: {
            ...newRow,
            endDate: this.convertToDDMMMYY(newRow.endDate),
          },
          reason: 'Invalid Data: No Success/ No Failed/ Start Date/ End Date',
        });
        rowsRejected++;
        continue;
      }

      if (typeof newRow.endDate === 'string') {
        rejectedRows.push({
          row: {
            ...newRow,
            startDate: this.convertToDDMMMYY(newRow.startDate),
          },
          reason: 'Invalid Data: No Success/ No Failed/ Start Date/ End Date',
        });
        rowsRejected++;
        continue;
      }

      if (
        !batchTitle ||
        !startDate ||
        !tech ||
        !trainingCoordinator ||
        !headTrainer
      ) {
        rowsRejected++;
        rejectedRows.push({
          row: {
            ...newRow,
            startDate: this.convertToDDMMMYY(newRow.startDate),
            endDate: this.convertToDDMMMYY(newRow.endDate),
          },
          reason:
            'Missing: Batch Title/ start Date/ Tech/ Training Coordinator/ Head Trainer',
        });
        continue;
      }

      if (NoSuccess == undefined) {
        newRow.NoSuccess = null;
      }
      if (NoFailed == undefined) {
        newRow.NoFailed = null;
      }

      const conditions = {
        batchTitle: batchTitle,
        tech: tech,
        startDate: formatedStartDate,
        trainingCoordinator: trainingCoordinator,
        headTrainer: headTrainer,
      };

      const existingRow: RawBatch[] = await this.batchesRepo.findExisting(
        conditions,
      );

      if (existingRow.length !== 0) {
        if (this.isDifferent(existingRow, newRow)) {
          //Update the Existing row
          //console.log(existingRow[0], newRow);
          await this.batchesRepo.updateData(existingRow[0], newRow);
          rowsUpdated++;
        } else {
          rowsRejected++;
          continue;
        }
      } else {
        // Insert new row into the main table
        await this.batchesRepo.createNewEntry(newRow);
        rowsInserted++;
      }
    }
    return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
  }

  // Function to check if other column beside PK's are same or not
  isDifferent(existing: RawBatch[], incoming: BatchesDto): boolean {
    return (
      this.convertToUnixTimestamp(existing[0].endDate) !==
        this.convertToUnixTimestamp(incoming.endDate) ||
      existing[0].NoOfTrainees !== incoming.NoOfTrainees ||
      existing[0].NoSuccess !== incoming.NoSuccess ||
      existing[0].NoFailed !== incoming.NoFailed
    );
  }

  // Function to convert date from Unix
  changeDateFormat(NewRowsdate: any) {
    const newDate = new Date((NewRowsdate - 25569) * 86400 * 1000);
    return newDate;
  }

  // Function to convert Date timestamp to Unix
  convertToUnixTimestamp(timestamp: Date): number {
    const dateObject = new Date(timestamp);
    const unixTimestamp = Math.floor(dateObject.getTime() / 1000);
    const millisecondsSinceEpoch = dateObject.getTime();
    return unixTimestamp;
  }

  convertToDDMMMYY(dateObject: Date) {
    if (!dateObject || typeof dateObject === 'string') {
      return null;
    }
    const day = dateObject.getUTCDate();
    const month = dateObject.toLocaleString('default', { month: 'short' });
    const year = dateObject.getUTCFullYear().toString().substr(-2);

    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }
}
