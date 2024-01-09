import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { JobService } from './job.service';
import { Job } from './entities/job.entity';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { SwaggerConstant } from 'src/core/constant/swagger.constants';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/core/enum/role.enum';
import {
  API_VERSION,
  API_VERSIONING_HEADER,
} from 'src/core/constant/env.constant';

@Controller({
  path: 'jobs',
  version: [API_VERSION, VERSION_NEUTRAL],
})
@ApiTags('Jobs')
@ApiBearerAuth()
@ApiHeader({
  name: API_VERSIONING_HEADER,
})
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class JobController {
  constructor(private jobService: JobService) {}

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
  @Get()
  getAllSummaries(
    @Query('pageNo') pageNo: number,
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
}
