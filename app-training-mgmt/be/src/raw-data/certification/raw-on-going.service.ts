import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawOnGoingRepository } from './raw-on-going.repository';
import { Helper } from 'src/core/helpers';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateOnGoingDto } from './dto/create-ongoing.dto';
import { RawOngoing } from './entities/raw-ongoing.entity';

@Injectable()
export class RawOnGoingService {
  private logger = new Logger(RawOnGoingService.name);
  constructor(
    private rawOnGoingRepo: RawOnGoingRepository,
    private dateHelper: Helper,
  ) {}

  getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
    certification: string,
  ): Promise<PaginatedResponse> {
    return this.rawOnGoingRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      name,
      certification,
    );
  }

  async insertOrUpdateOnGoing(newData: CreateOnGoingDto[]): Promise<object> {
    try {
      let rowsInserted = 0;
      let rowsUpdated = 0;
      let rowsRejected = 0;
      const rejectedRows = [];

      for (const newRow of newData) {
        const {
          empId,
          firstName,
          lastName,
          certification,
          exam,
          startDate,
          expectedEndDate,
          status,
          when,
          what,
        } = newRow;

        if (typeof startDate === 'number') {
          const formatedStarteDate =
            this.dateHelper.changeDateFormat(startDate);
          newRow.startDate = formatedStarteDate;
        } else {
          newRow.startDate = null;
        }

        if (typeof expectedEndDate === 'number') {
          const formatedEndDate =
            this.dateHelper.changeDateFormat(expectedEndDate);
          newRow.expectedEndDate = formatedEndDate;
        } else {
          newRow.expectedEndDate = null;
        }

        if (typeof when === 'number') {
          const formatedWhen = this.dateHelper.changeDateFormat(when);
          newRow.when = formatedWhen;
        } else {
          newRow.when = null;
        }

        if (typeof what === 'undefined') {
          newRow.what = null;
        }

        if (
          !empId ||
          !firstName ||
          !certification ||
          !lastName ||
          !exam ||
          !status
        ) {
          rowsRejected++;
          rejectedRows.push({
            row: {
              ...newRow,
              achievedDate: this.dateHelper.convertToDDMMMYY(newRow.startDate),
              expiryDate: this.dateHelper.convertToDDMMMYY(
                newRow.expectedEndDate,
              ),
            },
            reason:
              'Missing: empId/ first Name/ Certification/ level/ Exam/ Achieved date',
          });
          continue;
        }

        const conditions = {
          empId: newRow.empId,
          firstName: newRow.firstName,
          certification: newRow.certification,
          exam: newRow.exam,
        };

        const existingRow: any[] = await this.rawOnGoingRepo.findExisting(
          conditions,
        );

        if (existingRow.length !== 0) {
          if (this.isDifferent(existingRow, newRow)) {
            this.rawOnGoingRepo.update(existingRow[0], newRow);
            rowsUpdated++;
          } else {
            rowsRejected++;
            continue;
          }
        } else {
          // Insert new row into the main table
          this.rawOnGoingRepo.createNewEntry(newRow);
          rowsInserted++;
        }
      }
      return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawOnGoingService.name}/insertOrUpdateOnGoing`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  isDifferent(existing: RawOngoing[], incoming: CreateOnGoingDto): boolean {
    return (
      existing[0].lastName !== incoming.lastName ||
      this.dateHelper.convertToUnixTimestamp(existing[0].expectedEndDate) !=
        this.dateHelper.convertToUnixTimestamp(incoming.expectedEndDate) ||
      this.dateHelper.convertToUnixTimestamp(existing[0].startDate) !=
        this.dateHelper.convertToUnixTimestamp(incoming.startDate) ||
      existing[0].status !== incoming.status ||
      this.dateHelper.convertToUnixTimestamp(existing[0].when) !==
        this.dateHelper.convertToUnixTimestamp(incoming.when) ||
      existing[0].what !== incoming.what
    );
  }
}
