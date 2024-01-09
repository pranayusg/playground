import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Job } from './entities/job.entity';
import { JobRepository } from './job.repository';
import { JobStatus } from './enum/jobStatus.enum';
import { Cron } from '@nestjs/schedule';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { RawDataService } from 'src/raw-data/raw-data.service';
import { DataSource } from 'typeorm';
import { CHECK_NEW_JOBS_CRON_T } from 'src/core/constant/env.constant';
import {
  JOB_PENDING_MESSAGE,
  LOCK_FAILED_MESSAGE,
  NO_NEW_JOB_MESSAGE,
} from 'src/core/constant/constatnts';

@Injectable()
export class JobService {
  private logger = new Logger(JobService.name);
  constructor(
    private dataSource: DataSource,
    private summaryRepo: JobRepository,
    private rawDataService: RawDataService,
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

  @Cron(CHECK_NEW_JOBS_CRON_T, {
    name: 'cron_check_new_jobs',
  })
  async checkFiles() {
    const connection = this.dataSource.createQueryBuilder().connection;
    const lockId = 1; // Replace with a unique integer identifier for your lock

    // Try to acquire the advisory lock

    try {
      const pendingJob = await this.summaryRepo.getJobswithStatus(
        JobStatus.PENDING,
      );
      if (pendingJob.length === 1) {
        const message = JOB_PENDING_MESSAGE;
        // If the job is already running, skip this execution
        this.logger.warn(message);
        return message;
      }
      const lockResult = await connection.query(
        `SELECT pg_try_advisory_lock(${lockId})`,
      );

      if (lockResult[0].pg_try_advisory_lock) {
        await connection.query(`SELECT pg_advisory_lock(${lockId})`);
        const jobs: Job[] = await this.summaryRepo.getJobswithStatus(
          JobStatus.NEW,
        );
        if (jobs.length !== 0) {
          await this.rawDataService.processExcel(jobs[0]);
        } else {
          const message = NO_NEW_JOB_MESSAGE;
          this.logger.log(message);
          return message;
        }
      } else {
        this.logger.warn(LOCK_FAILED_MESSAGE);
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${JobService.name}/checkFiles`,
      );
      throw new InternalServerErrorException(error.message);
    } finally {
      // Always release the advisory lock
      await connection.query(`SELECT pg_advisory_unlock(${lockId})`);
    }
  }

  async changeStatus(jobId: string, status: JobStatus) {
    this.summaryRepo.changeStatus(jobId, status);
  }
}
