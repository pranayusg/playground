import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { RawTrainingDashboardService } from './overall-training/raw-training-dashboard.service';
import { JobRepository } from 'src/Job/job.repository';
import { RawBatchService } from './overall-training/raw-batch.service';
import { Job } from 'src/Job/entities/job.entity';
import { TrainingDashDto } from './overall-training/dto/training-dash.dto';
import { BatchesDto } from './overall-training/dto/createBatches.dto';
import {
  rejectedFilePath,
  uploadFilePath,
} from 'src/core/constant/file-paths.constants';
import {
  CertificationConstant,
  EmployeeMasterConstant,
  TrainingSheetsConstant,
} from 'src/core/constant/sheetNames.constants';
import { CreateRawEmployeeDto } from './employee-master/dto/create-raw-active-employee.dto';
import { RawActiveEmployeeService } from './employee-master/raw-active-employee.service';
import { RawResignedEmployeeService } from './employee-master/raw-resigned-employee.service';
import { CreateApprovedCertificationDto } from './certification/dto/create-approved-certification.dto';
import { RawApprovedCertificationService } from './certification/raw-approved-certification.service';
import { RawAchievedService } from './certification/raw-achieved.service';
import { CreateAchievedDto } from './certification/dto/create-achieved.dto';
import { CreateOnGoingDto } from './certification/dto/create-ongoing.dto';
import { RawOnGoingService } from './certification/raw-on-going.service';
import { JobStatus } from 'src/Job/enum/jobStatus.enum';
import { FILE_REJECTED_MESSAGE } from 'src/core/constant/constatnts';

@Injectable()
export class RawDataService {
  private logger = new Logger(RawDataService.name);
  constructor(
    private trainningDashService: RawTrainingDashboardService,
    private jobRepo: JobRepository,
    private batchesService: RawBatchService,
    private rawActiveEmployeeSevice: RawActiveEmployeeService,
    private rawResignedEmployeeSevice: RawResignedEmployeeService,
    private rawApprovedCertifications: RawApprovedCertificationService,
    private rawAchievedService: RawAchievedService,
    private rawOnGoingService: RawOnGoingService,
  ) {}

  async processExcel(job: Job) {
    try {
      let rejectedFileName: string;
      const { fileName, id } = job;
      const filePath = path.join(uploadFilePath, fileName);
      const workbook = XLSX.readFile(filePath);
      const sheets = [];
      //const sheetsToFind = ['Batches', 'Training Dashboard'];
      const sheetsToFind = [
        ...TrainingSheetsConstant,
        ...EmployeeMasterConstant,
        ...CertificationConstant,
      ];

      for (const sheetName of sheetsToFind) {
        const index = workbook.SheetNames.indexOf(sheetName);
        if (index !== -1) {
          sheets.push(index);
        }
      }

      await this.jobRepo.changeStatus(id, JobStatus.PENDING);

      for (const sheet of sheets) {
        const sheetName = workbook.SheetNames[sheet];
        const worksheet = workbook.Sheets[sheetName];

        if (sheetName === CertificationConstant[1]) {
          for (const cell in worksheet) {
            if (cell.startsWith('I')) {
              const linkObject = worksheet[cell].l;
              if (linkObject) {
                const linkTarget = linkObject.Target;
                worksheet[cell].v = linkTarget;
              }
            }
          }
        }
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
        });

        const filteredData: any[] = rawData.filter((row) =>
          row.some((cell) => cell !== null && cell !== ''),
        );

        if (sheetName === TrainingSheetsConstant[1]) {
          const rawTrainingDashboardExcelData: TrainingDashDto[] =
            filteredData.map((row) => ({
              empId: row[0],
              name: row[1],
              designation: row[2],
              reportingManager: row[3],
              clientDirector: row[4],
              clientName: row[5],
              resourceType: row[6],
              doj: row[7],
              trainer: row[8],
              typeOfTraining: row[9],
              batchType: row[10],
              batchTypeDescription: row[11],
              trainingStartDate: row[12],
              trainingEndDate: row[13],
              batchStatus: row[14],
              employeeStatus: row[15],
            }));
          const data: any =
            await this.trainningDashService.insertOrUpdateTrainingDash(
              rawTrainingDashboardExcelData.slice(1),
            );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              TrainingSheetsConstant[1],
              rejectedFileName,
              fileName,
              TrainingSheetsConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        } else if (sheetName === TrainingSheetsConstant[0]) {
          const rawBatchesExcelData: BatchesDto[] = filteredData.map((row) => ({
            batchTitle: row[0],
            tech: row[1],
            startDate: row[2],
            endDate: row[3],
            trainingCoordinator: row[4],
            headTrainer: row[5],
            noOfTrainees: row[6],
            noSuccess: row[7],
            noFailed: row[8],
            status: row[9],
          }));
          const data: any = await this.batchesService.insertOrUpdateBatches(
            rawBatchesExcelData.slice(4),
          );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              TrainingSheetsConstant[0],
              rejectedFileName,
              fileName,
              TrainingSheetsConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        } else if (sheetName === EmployeeMasterConstant[0]) {
          const rawActiveEmployeeExcelData: CreateRawEmployeeDto[] =
            filteredData.map((row) => ({
              employee: row[0],
              employeeNumber: row[1],
              email: row[2],
              doj: row[3],
              reportingTo: row[4],
              currGrade: row[5],
              currLocation: row[6],
              presentCity: row[7],
              presentState: row[8],
              currDepartment: row[9],
              currDesignation: row[10],
              currDesForReporting: row[11],
              leavingDate: row[12],
              currClient1: row[13],
              currClient2: row[14],
              currClient3: row[15],
              currClient4: row[16],
              currExperience: row[17],
              currPreviousEmployerExperience: row[18],
              yearsServedInCurrDesignation: row[19],
              currDesignationSince: row[20],
              currBusinessSystemQualification: row[21],
              currCoreTechStack: row[22],
              currSecondaryTechStack: row[23],
              currManagerialQualification: row[24],
              currPresonalInterests: row[25],
              employeeStatus: row[26],
            }));
          const data: any =
            await this.rawActiveEmployeeSevice.insertOrUpdateBatches(
              rawActiveEmployeeExcelData.slice(1),
            );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              EmployeeMasterConstant[0],
              rejectedFileName,
              fileName,
              EmployeeMasterConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        } else if (sheetName === EmployeeMasterConstant[1]) {
          const rawResignedEmployeeExcelData: CreateRawEmployeeDto[] =
            filteredData.map((row) => ({
              employee: row[0],
              employeeNumber: row[1],
              email: row[2],
              doj: row[3],
              reportingTo: row[4],
              currGrade: row[5],
              currLocation: row[6],
              presentCity: row[7],
              presentState: row[8],
              currDepartment: row[9],
              currDesignation: row[10],
              currDesForReporting: row[11],
              leavingDate: row[12],
              currClient1: row[13],
              currClient2: row[14],
              currClient3: row[15],
              currClient4: row[16],
              currExperience: row[17],
              currPreviousEmployerExperience: row[18],
              yearsServedInCurrDesignation: row[19],
              currDesignationSince: row[20],
              currBusinessSystemQualification: row[21],
              currCoreTechStack: row[22],
              currSecondaryTechStack: row[23],
              currManagerialQualification: row[24],
              currPresonalInterests: row[25],
              employeeStatus: row[26],
            }));
          const data: any =
            await this.rawResignedEmployeeSevice.insertOrUpdateBatches(
              rawResignedEmployeeExcelData.slice(1),
            );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              EmployeeMasterConstant[1],
              rejectedFileName,
              fileName,
              EmployeeMasterConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        } else if (sheetName === CertificationConstant[0]) {
          const rawApprovedCertificationData: CreateApprovedCertificationDto[] =
            filteredData.map((row) => ({
              tech: row[0],
              certificationName: row[1],
              level: row[2],
              costInDollars: row[3],
            }));
          const data: any =
            await this.rawApprovedCertifications.insertOrUpdateApprovedCertifications(
              rawApprovedCertificationData.slice(1),
            );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              CertificationConstant[0],
              rejectedFileName,
              fileName,
              CertificationConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        } else if (sheetName === CertificationConstant[1]) {
          const rawAchievedData: CreateAchievedDto[] = filteredData.map(
            (row) => ({
              empId: row[0],
              name: row[1],
              certification: row[2],
              level: row[3],
              exam: row[4],
              achievedDate: row[5],
              expiryDate: row[6],
              certificationLink: row[8],
            }),
          );
          const data: any =
            await this.rawAchievedService.insertOrUpdateAchieved(
              rawAchievedData.slice(1),
            );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              CertificationConstant[1],
              rejectedFileName,
              fileName,
              CertificationConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        } else if (sheetName === CertificationConstant[2]) {
          const rawOnGoingData: CreateOnGoingDto[] = filteredData.map(
            (row) => ({
              empId: row[0],
              firstName: row[1],
              lastName: row[2],
              certification: row[3],
              exam: row[4],
              startDate: row[5],
              expectedEndDate: row[6],
              status: row[7],
              when: row[8],
              what: row[9],
            }),
          );
          const data: any = await this.rawOnGoingService.insertOrUpdateOnGoing(
            rawOnGoingData.slice(1),
          );

          if (data.rejectedRows.length !== 0) {
            rejectedFileName = this.generateRejectedExcel(
              data.rejectedRows,
              CertificationConstant[2],
              rejectedFileName,
              fileName,
              CertificationConstant,
            );
          }
          await this.jobRepo.updateSummary(
            id,
            data,
            sheetName,
            rejectedFileName,
          );
        }
      }
      await this.jobRepo.changeStatus(id, JobStatus.COMPLETED);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawDataService.name}/processExcel`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  checkSheets(file: any, filePath: string, sheets: any[]) {
    const workbook = XLSX.read(file);

    const requiredSheetNames = sheets;

    const missingSheets = requiredSheetNames.filter(
      (sheetName) => !workbook.SheetNames.includes(sheetName),
    );
    if (missingSheets.length > 0) {
      fs.unlinkSync(filePath);
      this.logger.warn(`${FILE_REJECTED_MESSAGE} ${missingSheets.join(', ')}`);
      throw new HttpException(
        `${FILE_REJECTED_MESSAGE} ${missingSheets.join(', ')}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  generateRejectedExcel(
    rejectedRows: { row: TrainingDashDto | BatchesDto; reason: string }[],
    sheetName: string,
    timestampedname: string,
    fileName: string,
    predefinedSheetNames: any,
  ) {
    try {
      let timestampedFilename: string;
      const targetDirectory = rejectedFilePath;

      if (!fs.existsSync(targetDirectory)) {
        fs.mkdirSync(targetDirectory, { recursive: true });
      }

      if (!timestampedname) {
        timestampedFilename = path.join(
          targetDirectory,
          `rejected-rows_${fileName}`,
        );
      } else {
        timestampedFilename = timestampedname;
      }

      let wb: XLSX.WorkBook;
      try {
        // Try to read the existing Excel file
        const existingData = XLSX.readFile(timestampedFilename);
        wb = existingData;
      } catch (error) {
        // Create a new Excel file if it doesn't exist
        wb = XLSX.utils.book_new();
      }

      // Create sheets for all predefined sheet names
      predefinedSheetNames.forEach((sheet) => {
        const ws = XLSX.utils.json_to_sheet(
          rejectedRows.map((item) => ({
            ...item.row,
            ReasonForRejection: item.reason,
          })),
        );

        if (sheet === sheetName) {
          // If the current sheet matches the provided sheetName, save data to it
          if (wb.SheetNames.includes(sheetName)) {
            // If the sheet already exists, replace its data
            wb.Sheets[sheetName] = ws;
          } else {
            // Add the sheet if it doesn't exist
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
          }
        } else {
          // For other predefined sheets, just add them without data
          if (!wb.SheetNames.includes(sheet)) {
            XLSX.utils.book_append_sheet(wb, {}, sheet);
          }
        }
      });

      XLSX.writeFile(wb, timestampedFilename);
      return timestampedFilename;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawDataService.name}/generateRejectedExcel`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
