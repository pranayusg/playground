import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawAchievedRepository } from './raw-achieved.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateAchievedDto } from './dto/create-achieved.dto';
import { RawAchieved } from './entities/raw-achieved.entity';
import { Helper } from 'src/core/helpers';

@Injectable()
export class RawAchievedService {
  private logger = new Logger(RawAchievedService.name);
  constructor(
    private rawAchievedRepo: RawAchievedRepository,
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
    return this.rawAchievedRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      name,
      certification,
    );
  }

  async insertOrUpdateAchieved(newData: CreateAchievedDto[]): Promise<object> {
    try {
      let rowsInserted = 0;
      let rowsUpdated = 0;
      let rowsRejected = 0;
      const rejectedRows = [];

      for (const newRow of newData) {
        const {
          empId,
          name,
          certification,
          level,
          exam,
          achievedDate,
          expiryDate,
          certificationLink,
        } = newRow;

        if (typeof achievedDate === 'number') {
          const formatedAchievedDate =
            this.dateHelper.changeDateFormat(achievedDate);
          newRow.achievedDate = formatedAchievedDate;
        }

        if (typeof expiryDate === 'number') {
          const formatedExpiryDate =
            this.dateHelper.changeDateFormat(expiryDate);
          newRow.expiryDate = formatedExpiryDate;
        } else {
          newRow.expiryDate = null;
        }

        if (
          !empId ||
          !name ||
          !certification ||
          !level ||
          !exam ||
          !achievedDate
        ) {
          rowsRejected++;
          rejectedRows.push({
            row: {
              ...newRow,
              achievedDate: this.dateHelper.convertToDDMMMYY(
                newRow.achievedDate,
              ),
              expiryDate: this.dateHelper.convertToDDMMMYY(newRow.expiryDate),
            },
            reason:
              'Missing: empId/ first Name/ Certification/ level/ Exam/ Achieved date',
          });
          continue;
        }

        if (!certificationLink) {
          newRow.certificationLink = 'NA';
        }

        newRow.certification = this.removeDoubleSpaces(newRow.certification);
        newRow.exam = this.removeDoubleSpaces(newRow.exam);
        newRow.level = this.removeDoubleSpaces(newRow.level);

        const conditions = {
          empId: newRow.empId,
          name: newRow.name,
          certification: newRow.certification,
          level: newRow.level,
          exam: newRow.exam,
        };

        const existingRow: any[] = await this.rawAchievedRepo.findExisting(
          conditions,
        );

        if (existingRow.length !== 0) {
          if (this.isDifferent(existingRow, newRow)) {
            this.rawAchievedRepo.update(existingRow[0], {
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
          this.rawAchievedRepo.createNewEntry(newRow);
          rowsInserted++;
        }
      }
      return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawAchievedService.name}/insertOrUpdateAchieved`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  isDifferent(existing: RawAchieved[], incoming: CreateAchievedDto): boolean {
    return (
      existing[0].certification !== incoming.certification ||
      existing[0].level !== incoming.level ||
      existing[0].exam !== incoming.exam ||
      this.dateHelper.convertToUnixTimestamp(existing[0].achievedDate) !=
        this.dateHelper.convertToUnixTimestamp(incoming.achievedDate) ||
      this.dateHelper.convertToUnixTimestamp(existing[0].expiryDate) !=
        this.dateHelper.convertToUnixTimestamp(incoming.expiryDate) ||
      existing[0].certificationLink !== incoming.certificationLink
    );
  }

  removeDoubleSpaces(text: string) {
    const result = text.replace(/\s{2,}/g, ' ');
    return result.trimEnd();
  }
}
