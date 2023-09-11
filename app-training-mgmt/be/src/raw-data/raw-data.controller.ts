import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedResponse } from 'src/core/pagination.interface';
import { SwaggerConstant } from 'src/core/swagger.constants';
import { RawBatchService } from './raw-batch.service';
import { RawTrainingDashboardService } from './raw-training-dashboard.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as path from 'path';
import * as fs from 'fs';
import { RawDataService } from './raw-data.service';
import { Job } from 'src/Job/entities/job.entity';
import { JobService } from 'src/Job/job.service';
import { RawBatch } from './entities/raw-batch.entity';
import { RawTrainingDashboard } from './entities/raw-training-dashboard.entity';
import { uploadFilePath } from 'src/core/file-paths.constants';
import { RawActiveEmployeeService } from './raw-active-employee.service';
import { RawResignedEmployeeService } from './raw-resigned-employee.service';

@Controller('raw-data')
export class RawDataController {
  constructor(
    private batchesService: RawBatchService,
    private trainingDashService: RawTrainingDashboardService,
    private rawDataService: RawDataService,
    private importService: JobService,
    private rawActiveEmployeeService: RawActiveEmployeeService,
    private rawResignedEmployeeService: RawResignedEmployeeService,
  ) {}

  @ApiTags('File upload')
  @ApiOperation({
    description: 'Endpoint to upload the Overall Dashboard file.',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiBadRequestResponse({ description: 'File not selected' })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Post('/dashboard/import')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExcelFile1(@UploadedFile() file) {
    if (!file) {
      throw new HttpException(
        'Please select a file to import',
        HttpStatus.BAD_REQUEST,
      );
    }

    const now = new Date();
    const dateSuffix = now.toISOString().replace(/:/g, '-');
    const timestampedFilename = `${dateSuffix}_${file.originalname}`;

    const targetDirectory = uploadFilePath;

    // Create the target directory if it doesn't exist
    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, { recursive: true });
    }

    const filePath = path.join(targetDirectory, timestampedFilename);

    fs.writeFileSync(filePath, file.buffer);

    this.rawDataService.checkSheets(file.buffer, filePath);

    const jobDetail: Job = await this.importService.createSummary(
      timestampedFilename,
      filePath,
      true,
      file.originalname,
    );

    return {
      jobId: jobDetail.jobId,
      status: jobDetail.status,
      fileName: jobDetail.fileName,
    };
  }

  @ApiTags('Raw-data')
  @Get('/batch/tech')
  getTech() {
    return this.batchesService.getTech();
  }

  @ApiTags('Raw-data')
  @ApiOperation({ description: 'Get all the data from Batches sheet' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'noOfRecords',
    required: false,
    description: 'Set how many records you want to display.',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
  })
  @ApiQuery({
    name: 'status',
    required: false,
  })
  @ApiQuery({
    name: 'tech',
    required: false,
  })
  @Get('/batch')
  getAll(
    @Query('page') pageNo: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
    @Query('status') status: string,
    @Query('tech') tech: string,
  ): Promise<PaginatedResponse | RawBatch[]> {
    return this.batchesService.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      status,
      tech,
    );
  }

  @ApiTags('Raw-data')
  @ApiOperation({
    description: 'Get all data from Training Dashboard Excel sheet',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Name to search for',
  })
  @ApiQuery({
    name: 'noOfRecords',
    required: false,
    description: 'Set the no. of rows needs to be displayed.',
  })
  @ApiQuery({
    name: 'orderBy',
    required: false,
  })
  @Get('/training-dashboard')
  getAllTrainingDashboard(
    @Query('page') pageNo: number,
    @Query('name') name: string,
    @Query('noOfRecords') noOfRecords: number,
    @Query('orderBy') orderBy: string,
  ): Promise<PaginatedResponse | RawTrainingDashboard[]> {
    return this.trainingDashService.getAll(pageNo, noOfRecords, name, orderBy);
  }

  @ApiTags('Raw-data')
  @ApiOperation({
    description:
      'Get all data from Employee Master excel files Active employee sheet',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Name to search for',
  })
  @ApiQuery({
    name: 'noOfRecords',
    required: false,
    description: 'Set the no. of rows needs to be displayed.',
  })
  @Get('/active-employee')
  getAllActiveEmployee(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('name') name: string,
  ) {
    return this.rawActiveEmployeeService.getAll(page, noOfRecords, name);
  }

  @ApiTags('Raw-data')
  @ApiOperation({
    description:
      'Get all data from Employee Master excel files Resigned employee sheet',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'page',
  })
  @ApiQuery({
    name: 'name',
    required: false,
    description: 'Name to search for',
  })
  @ApiQuery({
    name: 'noOfRecords',
    required: false,
    description: 'Set the no. of rows needs to be displayed.',
  })
  @Get('/resigned-employee')
  getAllResignedEmployee(
    @Query('page') page: number,
    @Query('noOfRecords') noOfRecords: number,
    @Query('name') name: string,
  ) {
    return this.rawResignedEmployeeService.getAll(page, noOfRecords, name);
  }
}
