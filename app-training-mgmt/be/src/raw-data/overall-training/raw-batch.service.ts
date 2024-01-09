import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawBatch } from './entities/raw-batch.entity';
import { RawBatchRepository } from './raw-batch.repository';
import { BatchesDto } from './dto/createBatches.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { Helper } from 'src/core/helpers';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/core/constant/cache.constants';
import { ConfigService } from '@nestjs/config';
import { CACHE_TTL_ENV } from 'src/core/constant/env.constant';

@Injectable()
export class RawBatchService {
  private logger = new Logger(RawBatchService.name);
  constructor(
    private batchesRepo: RawBatchRepository,
    private datesHelper: Helper,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}
  private CACHE_TTL = Number(this.configService.get<number>(CACHE_TTL_ENV));

  getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    status: string,
    tech: string,
  ): Promise<PaginatedResponse> {
    return this.batchesRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      status,
      tech,
    );
  }

  async getTech() {
    let value = await this.cacheManager.get(CacheKeys.RAW_BATCH_TECH);
    if (value) {
      return value;
    } else {
      value = await this.batchesRepo.getTech();
      await this.cacheManager.set(
        CacheKeys.RAW_BATCH_TECH,
        value,
        this.CACHE_TTL,
      );
      return value;
    }
  }

  async getStatus() {
    let value = await this.cacheManager.get(CacheKeys.RAW_BATCH_STATUS);
    if (value) {
      return value;
    } else {
      value = await this.batchesRepo.getStatus();
      await this.cacheManager.set(
        CacheKeys.RAW_BATCH_STATUS,
        value,
        this.CACHE_TTL,
      );
      return value;
    }
  }

  async insertOrUpdateBatches(newData: BatchesDto[]): Promise<object> {
    try {
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
          noSuccess,
          noFailed,
        } = newRow;

        if (typeof startDate === 'number') {
          formatedStartDate = this.datesHelper.changeDateFormat(startDate);
          newRow.startDate = formatedStartDate;
        }
        if (endDate === undefined || typeof newRow.endDate === 'string') {
          newRow.endDate = null;
        } else {
          const formatedEndDate: Date =
            this.datesHelper.changeDateFormat(endDate);
          newRow.endDate = formatedEndDate;
        }

        if (typeof newRow.noSuccess === 'string') {
          newRow.noSuccess = 0;
        }

        if (typeof newRow.noFailed === 'string') {
          newRow.noFailed = 0;
        }

        if (typeof newRow.startDate === 'string') {
          rejectedRows.push({
            row: {
              ...newRow,
              endDate: this.datesHelper.convertToDDMMMYY(newRow.endDate),
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
              startDate: this.datesHelper.convertToDDMMMYY(newRow.startDate),
              endDate: this.datesHelper.convertToDDMMMYY(newRow.endDate),
            },
            reason:
              'Missing: Batch Title/ start Date/ Tech/ Training Coordinator/ Head Trainer',
          });
          continue;
        }

        if (noSuccess == undefined) {
          newRow.noSuccess = null;
        }
        if (noFailed == undefined) {
          newRow.noFailed = null;
        }

        if (newRow.status === 'Complete') {
          newRow.status = 'Completed';
        }

        if (newRow.status) {
          newRow.status = newRow.status.replace(/\s+/g, '');
          const regex = /([a-z])([A-Z])/g;
          newRow.status = newRow.status.replace(regex, '$1 $2');
        }

        newRow.tech = this.formatText(newRow.tech);
        newRow.batchTitle = this.formatText(newRow.batchTitle);

        const conditions = {
          batchTitle: newRow.batchTitle,
          tech: newRow.tech,
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
            await this.batchesRepo.updateData(existingRow[0], {
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
          await this.batchesRepo.createNewEntry(newRow);
          rowsInserted++;
        }
      }
      return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawBatchService.name}/insertOrUpdateBatches`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  // Function to check if other column beside PK's are same or not
  isDifferent(existing: RawBatch[], incoming: BatchesDto): boolean {
    return (
      this.datesHelper.convertToUnixTimestamp(existing[0].endDate) !==
        this.datesHelper.convertToUnixTimestamp(incoming.endDate) ||
      existing[0].noOfTrainees !== incoming.noOfTrainees ||
      existing[0].noSuccess !== incoming.noSuccess ||
      existing[0].noFailed !== incoming.noFailed
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
