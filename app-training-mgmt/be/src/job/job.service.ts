import { Injectable, Logger } from '@nestjs/common';
import { Job } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { JobStatus } from './enum/jobStatus.enum';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { PaginatedResponse } from 'src/core/pagination.interface';
import { RawDataService } from 'src/raw-data/raw-data.service';

@Injectable()
export class JobService {
  private logger = new Logger('JobService');
  constructor(
    private summaryRepo: JobRepository,
    private rawDataService: RawDataService,
    private configService: ConfigService,
  ) {}

  getAllSummaries(
    pageNo: number,
    noOfRecords: number,
    status: string,
  ): Promise<PaginatedResponse> {
    return this.summaryRepo.getAllJobs(pageNo, noOfRecords, status);
  }

  async createSummary(
    filename: string,
    filePath: string,
    jobType: boolean,
    originalName: string,
  ): Promise<Job> {
    return this.summaryRepo.createJob(
      filename,
      filePath,
      jobType,
      originalName,
    );
  }

  getSingleJob(jobId: string): Promise<Job> {
    return this.summaryRepo.getJob(jobId);
  }

  @Cron('*/30 * * * * *', {
    name: 'check_new_jobs',
  })
  async checkFiles() {
    const jobs: Job[] = await this.summaryRepo.getNewJobs();
    if (jobs.length !== 0) {
      for (const job of jobs) {
        this.rawDataService.processExcel(job);
      }
    } else {
      this.logger.log('No New job pending.');
      return 'No New job pending.';
    }
    return jobs;
  }

  async changeStatus(jobId: string, status: JobStatus) {
    this.summaryRepo.changeStatus(jobId, status);
  }
}
