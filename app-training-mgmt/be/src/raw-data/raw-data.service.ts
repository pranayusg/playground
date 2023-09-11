import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as XLSX from 'xlsx';
import { RawTrainingDashboardService } from './raw-training-dashboard.service';
import { JobRepository } from 'src/Job/job.repository';
import { RawBatchService } from './raw-batch.service';
import { Job } from 'src/Job/entities/job.entity';
import { JobStatus } from 'src/Job/enum/jobStatus.enum';
import { TrainingDashDto } from './dto/training-dash.dto';
import { BatchesDto } from './dto/createBatches.dto';
import { SheetNamesConstant } from 'src/core/sheetNames.constants';
import {
  rejectedFilePath,
  uploadFilePath,
} from 'src/core/file-paths.constants';

@Injectable()
export class RawDataService {
  private logger = new Logger('AppService');
  constructor(
    private trainningDashService: RawTrainingDashboardService,
    private jobRepo: JobRepository,
    private batchesService: RawBatchService,
  ) {}

  async processExcel(job: Job) {
    let rejectedFileName: string;
    const { fileName, jobId } = job;
    const filePath = path.join(uploadFilePath, fileName);
    const workbook = XLSX.readFile(filePath);

    let sheets = [];
    const sheetsToFind = ['Batches', 'Training Dashboard'];

    for (const sheetName of sheetsToFind) {
      const index = workbook.SheetNames.indexOf(sheetName);
      if (index !== -1) {
        sheets.push(index);
      }
    }
    this.jobRepo.changeStatus(jobId, JobStatus.PENDING);
    for (const sheet of sheets) {
      const sheetName = workbook.SheetNames[sheet];
      console.log(sheetName);
      const worksheet = workbook.Sheets[sheetName];

      const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const filteredData: any[] = rawData.filter((row) =>
        row.some((cell) => cell !== null && cell !== ''),
      );

      if (sheetName === 'Training Dashboard') {
        const excelData: TrainingDashDto[] = filteredData.map((row) => ({
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
            excelData.slice(1),
          );
        await this.jobRepo.updateSummary(jobId, data, sheetName);
        rejectedFileName = this.generateRejectedExcel(
          data.rejectedRows,
          'Training Dashboard',
          rejectedFileName,
          fileName,
        );
        console.log('Trainning Dashboard DATA............', data);
      } else if (sheetName === 'Batches') {
        const BatchesexcelData: BatchesDto[] = filteredData.map((row) => ({
          batchTitle: row[0],
          tech: row[1],
          startDate: row[2],
          endDate: row[3],
          trainingCoordinator: row[4],
          headTrainer: row[5],
          NoOfTrainees: row[6],
          NoSuccess: row[7],
          NoFailed: row[8],
          status: row[9],
        }));
        const data: any = await this.batchesService.insertOrUpdateBatches(
          BatchesexcelData.slice(1),
        );
        await this.jobRepo.updateSummary(jobId, data, sheetName);
        rejectedFileName = this.generateRejectedExcel(
          data.rejectedRows,
          'Batches',
          rejectedFileName,
          fileName,
        );
        console.log('Batches DATA............', data);
      }
    }
    this.jobRepo.changeStatus(jobId, JobStatus.COMPLETED);
  }

  checkSheets(file: any, filePath: string) {
    const workbook = XLSX.read(file);

    const requiredSheetNames = SheetNamesConstant;

    const missingSheets = requiredSheetNames.filter(
      (sheetName) => !workbook.SheetNames.includes(sheetName),
    );
    if (missingSheets.length > 0) {
      fs.unlinkSync(filePath);
      this.logger.warn(
        `File rejected as required sheets are missing: ${missingSheets.join(
          ', ',
        )}`,
      );
      throw new HttpException(
        `File rejected as required sheets are missing: ${missingSheets.join(
          ', ',
        )}`,
        HttpStatus.OK,
      );
    }
  }

  generateRejectedExcel(
    rejectedRows: { row: TrainingDashDto | BatchesDto; reason: string }[],
    sheetName: string,
    timestampedname: string,
    fileName: string,
  ) {
    let timestampedFilename: string;
    const targetDirectory = rejectedFilePath;

    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    if (!timestampedname) {
      const excelFileName = 'RejectedRows.xlsx'; // You can customize the file name
      const now = new Date();
      const dateSuffix = now.toISOString().replace(/:/g, '-');
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

    const ws = XLSX.utils.json_to_sheet(
      rejectedRows.map((item) => ({
        ...item.row,
        ReasonForRejection: item.reason,
      })),
    );

    if (wb.SheetNames.includes(sheetName)) {
      // If the sheet already exists, replace its data
      wb.Sheets[sheetName] = ws;
    } else {
      // Add the sheet if it doesn't exist
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    }

    XLSX.writeFile(wb, timestampedFilename);
    return timestampedFilename;
  }
}
