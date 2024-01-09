import { Job } from './entities/job.entity';
import { DataSource, Repository } from 'typeorm';
import { JobStatus } from './enum/jobStatus.enum';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';

@Injectable()
export class JobRepository extends Repository<Job> {
  private logger = new Logger(JobRepository.name);
  constructor(private dataSource: DataSource) {
    super(Job, dataSource.createEntityManager());
  }

  async createJob(
    filename: string,
    filePath: string,
    jobType: boolean,
    originalName: string,
  ): Promise<Job> {
    try {
      if (jobType) {
        const newUser = this.create({
          fileName: filename,
          filePath: filePath,
          status: JobStatus.NEW,
          jobType: 'Imported',
          importType: originalName,
        });
        const createdSummary = await this.save(newUser);
        return createdSummary;
      }
      const newUser = this.create({
        fileName: filename,
        filePath: filePath,
        status: JobStatus.NEW,
        importType: originalName,
      });
      const createdSummary = await this.save(newUser);

      return createdSummary;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${JobRepository.name}/createJob`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async getAllJobs(
    pageNo: number,
    noOfRecords: number,
    status: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;

      let queryBuilder = this.createQueryBuilder('entity')
        .orderBy('entity.createdAt', OrderValue.DESC)
        .take(take)
        .skip(skip);

      if (status) {
        queryBuilder = queryBuilder.where('entity.status ILIKE :status', {
          status: `%${status}%`,
        });
      }

      const [result, total] = await queryBuilder.getManyAndCount();

      const totalPages = Math.ceil(total / take);

      return {
        records: result,
        totalRecords: total,
        totalPages,
        currentPage: Number(page),
      };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${JobRepository.name}/getAllJobs`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getJobswithStatus(status: string): Promise<Job[]> {
    const job = this.find({ where: { status: status } });
    return job;
  }

  async getJob(jobId: string): Promise<Job> {
    const job: Job = await this.findOne({
      where: { id: jobId },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID: ${jobId} Not Found`);
    }
    return job;
  }

  async changeStatus(jobId: string, status: JobStatus) {
    try {
      const job: Job = await this.getJob(jobId);
      job.status = status;
      await this.save(job);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${JobRepository.name}/changeStatus`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateSummary(
    jobId: string,
    data: any,
    sheetName: string,
    rejectedFilePath: string,
  ) {
    const entity = await this.getJob(jobId);

    try {
      const { rowsInserted, rowsRejected, rowsUpdated } = data;

      if (!Array.isArray(entity.summary)) {
        entity.summary = [];
      }

      // entity.rowsInserted += rowsInserted;
      // entity.rowsUpdated += rowsUpdated;
      // entity.rowsRejected += rowsRejected
      const updatedSummary = [
        ...entity.summary,
        { sheetName, rowsInserted, rowsUpdated, rowsRejected },
      ];

      entity.summary = updatedSummary;
      entity.errorFileLink = rejectedFilePath;
      return this.save(entity);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${JobRepository.name}/updateSummary`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
