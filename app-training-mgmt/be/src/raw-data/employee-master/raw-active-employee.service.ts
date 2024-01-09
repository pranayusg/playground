import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawActiveEmployeeRepository } from './raw-active-employee.repository';
import { CreateRawEmployeeDto } from './dto/create-raw-active-employee.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { RawActiveEmployee } from './entities/raw-active-employee.entity';
import { Helper } from 'src/core/helpers';

@Injectable()
export class RawActiveEmployeeService {
  private logger = new Logger(RawActiveEmployeeService.name);
  constructor(
    private rawActiveEmployeeRepo: RawActiveEmployeeRepository,
    private datesHelper: Helper,
  ) {}

  createEntry(newData: CreateRawEmployeeDto) {
    return this.rawActiveEmployeeRepo.createNewEntry(newData);
  }

  getAll(
    page: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
  ): Promise<PaginatedResponse> {
    return this.rawActiveEmployeeRepo.getAll(
      page,
      noOfRecords,
      orderBy,
      order,
      name,
    );
  }

  async insertOrUpdateBatches(
    newData: CreateRawEmployeeDto[],
  ): Promise<object> {
    try {
      let rowsInserted = 0;
      let rowsUpdated = 0;
      let rowsRejected = 0;
      const rejectedRows = [];

      for (const newRow of newData) {
        const { employeeNumber, doj, currDesignationSince } = newRow;

        for (const key in newRow) {
          if (newRow.hasOwnProperty(key) && newRow[key] === undefined) {
            newRow[key] = null;
          }
        }

        if (typeof doj === 'number') {
          const formatedDoj = this.datesHelper.changeDateFormat(doj);
          newRow.doj = formatedDoj;
        }

        if (currDesignationSince !== null) {
          const formatedCurrDesignationSince: Date =
            this.datesHelper.changeDateFormat(currDesignationSince);
          newRow.currDesignationSince = formatedCurrDesignationSince;
        }

        if (typeof newRow.currExperience === 'string') {
          newRow.currExperience = parseFloat(newRow.currExperience);
        }

        if (typeof newRow.currPreviousEmployerExperience === 'string') {
          newRow.currPreviousEmployerExperience = parseFloat(
            newRow.currPreviousEmployerExperience,
          );
        }

        if (typeof newRow.yearsServedInCurrDesignation === 'string') {
          newRow.yearsServedInCurrDesignation = parseFloat(
            newRow.yearsServedInCurrDesignation,
          );
        }

        if (
          newRow.employee === null ||
          newRow.employeeNumber === null ||
          newRow.email === null ||
          newRow.doj === null ||
          newRow.currDesignation === null ||
          newRow.currDesForReporting === null
        ) {
          rejectedRows.push({
            row: {
              ...newRow,
              doj: this.datesHelper.convertToDDMMMYY(newRow.doj),
              currDesignationSince: this.datesHelper.convertToDDMMMYY(
                newRow.currDesignationSince,
              ),
            },
            reason:
              'Empty Column: Employee/Employee Number/Email/DOJ/curr.Designation/curr.Desination For Reporting',
          });
          rowsRejected++;
          continue;
        }

        const conditions = {
          employeeNumber,
        };

        const existingRow = await this.rawActiveEmployeeRepo.findExisting(
          conditions,
        );

        if (existingRow.length !== 0) {
          if (this.isDifferent(existingRow, newRow)) {
            //Update the Existing row
            await this.rawActiveEmployeeRepo.updateData(existingRow[0], {
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
          await this.rawActiveEmployeeRepo.createNewEntry(newRow);
          rowsInserted++;
        }
      }
      return { rowsInserted, rowsUpdated, rowsRejected, rejectedRows };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawActiveEmployeeService.name}/insertOrUpdateBatches`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  isDifferent(
    existing: RawActiveEmployee[],
    incoming: CreateRawEmployeeDto,
  ): boolean {
    return (
      this.datesHelper.convertToUnixTimestamp(existing[0].doj) !=
        this.datesHelper.convertToUnixTimestamp(incoming.doj) ||
      existing[0].employee != incoming.employee ||
      existing[0].email != incoming.email ||
      existing[0].reportingTo != incoming.reportingTo ||
      existing[0].currGrade != incoming.currGrade ||
      existing[0].currLocation != incoming.currLocation ||
      existing[0].presentCity != incoming.presentCity ||
      existing[0].presentState != incoming.presentState ||
      existing[0].currDepartment != incoming.currDepartment ||
      existing[0].currDesignation != incoming.currDesignation ||
      existing[0].currDesForReporting != incoming.currDesForReporting ||
      this.datesHelper.convertToUnixTimestamp(existing[0].leavingDate) !=
        this.datesHelper.convertToUnixTimestamp(incoming.leavingDate) ||
      existing[0].currClient1 != incoming.currClient1 ||
      existing[0].currClient2 != incoming.currClient2 ||
      existing[0].currClient3 != incoming.currClient3 ||
      existing[0].currClient4 != incoming.currClient4 ||
      existing[0].currExperience != incoming.currExperience ||
      existing[0].currPreviousEmployerExperience !=
        incoming.currPreviousEmployerExperience ||
      existing[0].yearsServedInCurrDesignation !=
        incoming.yearsServedInCurrDesignation ||
      this.datesHelper.convertToUnixTimestamp(
        existing[0].currDesignationSince,
      ) !=
        this.datesHelper.convertToUnixTimestamp(
          incoming.currDesignationSince,
        ) ||
      existing[0].currBusinessSystemQualification !=
        incoming.currBusinessSystemQualification ||
      existing[0].currCoreTechStack != incoming.currCoreTechStack ||
      existing[0].currSecondaryTechStack != incoming.currSecondaryTechStack ||
      existing[0].currManagerialQualification !=
        incoming.currManagerialQualification ||
      existing[0].currPresonalInterests != incoming.currPresonalInterests ||
      existing[0].employeeStatus != incoming.employeeStatus
    );
  }
}
