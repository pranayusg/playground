import { Controller, Get, Param, Query } from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';
import {
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerConstant } from 'src/core/swagger.constants';
import { PaginatedResponse } from 'src/core/pagination.interface';

@ApiTags('Import jobs')
@Controller('job')
export class JobController {
  constructor(private jobService: JobService) {}

  @ApiOperation({ description: 'Get all the imported jobs.' })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'status to search for',
  })
  @ApiQuery({
    name: 'noOfRecords',
    required: false,
    description: 'Set the no. of rows needs to be displayed.',
  })
  @Get('/:pageNo')
  getAllSummaries(
    @Param('pageNo') pageNo: number,
    @Query('status') status: string,
    @Query('noOfRecords') noOfRecords: number,
  ): Promise<PaginatedResponse> {
    return this.jobService.getAllSummaries(pageNo, noOfRecords, status);
  }

  @ApiOperation({
    description: 'Get a Single import summary for the provided jobId.',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiNotFoundResponse({ description: SwaggerConstant.NotFoundRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('/:jobId')
  getSingleJob(@Param('jobId') jobId: string): Promise<Job> {
    return this.jobService.getSingleJob(jobId);
  }

  @ApiTags('Process data')
  @ApiOperation({
    description:
      'This will check if any job with status "New" is present in import_summary table and will process that file. (This function will automaticaly run via a Cron job)',
  })
  @ApiOkResponse({ description: SwaggerConstant.OkRes })
  @ApiInternalServerErrorResponse({
    description: SwaggerConstant.InternalServerErrorRes,
  })
  @Get('/process-new-job')
  checkForFile() {
    return this.jobService.checkFiles();
  }
}
