import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawApprovedCertificationRepository } from './raw-approved-certification.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateApprovedCertificationDto } from './dto/create-approved-certification.dto';
import { RawApprovedCertification } from './entities/raw-approved-certification.entity';

@Injectable()
export class RawApprovedCertificationService {
  private logger = new Logger(RawApprovedCertificationService.name);
  constructor(
    private rawApprovedCertificationRepo: RawApprovedCertificationRepository,
  ) {}

  createEntry(newData: CreateApprovedCertificationDto) {
    return this.rawApprovedCertificationRepo.createNewEntry(newData);
  }

  getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    certificationName: string,
    level: string,
  ): Promise<PaginatedResponse> {
    return this.rawApprovedCertificationRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      certificationName,
      level,
    );
  }

  async insertOrUpdateApprovedCertifications(
    newData: CreateApprovedCertificationDto[],
  ): Promise<object> {
    try {
      let rowsInserted = 0;
      let rowsUpdated = 0;
      let rowsRejected = 0;
      const rejectedRows = [];

      for (const newRow of newData) {
        const { tech, certificationName, level } = newRow;

        if (!tech || !certificationName || !level) {
          rowsRejected++;
          rejectedRows.push({
            row: newRow,
            reason: 'Missing: Tech/ Certification Name/ level',
          });
          continue;
        }

        if (typeof newRow.costInDollars === 'undefined') {
          newRow.costInDollars = null;
        }

        if (typeof newRow.costInDollars === 'string') {
          rowsRejected++;
          rejectedRows.push({
            row: newRow,
            reason: 'Invalid data: Cost in Dollars must be a number.',
          });
          continue;
        }

        newRow.tech = this.removeDoubleSpaces(newRow.tech);
        newRow.certificationName = this.removeDoubleSpaces(
          newRow.certificationName,
        );
        newRow.level = this.removeDoubleSpaces(newRow.level);

        const conditions = {
          tech: newRow.tech,
          certificationName: newRow.certificationName,
          level: newRow.level,
        };

        const existingRow: any[] =
          await this.rawApprovedCertificationRepo.findExisting(conditions);

        if (existingRow.length !== 0) {
          if (this.isDifferent(existingRow, newRow)) {
            this.rawApprovedCertificationRepo.update(existingRow[0], {
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
          this.rawApprovedCertificationRepo.createNewEntry(newRow);
          rowsInserted++;
        }
      }
      return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawApprovedCertificationService.name}/insertOrUpdateApprovedCertifications`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  isDifferent(
    existing: RawApprovedCertification[],
    incoming: CreateApprovedCertificationDto,
  ): boolean {
    return existing[0].costInDollars !== incoming.costInDollars;
  }

  removeDoubleSpaces(text: string) {
    const result = text.replace(/\s{2,}/g, ' ');
    return result.trimEnd();
  }
}
