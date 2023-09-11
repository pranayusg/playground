import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateJobDto } from './dto/createJobs.dto';
import { JobStatus } from './enum/jobStatus.enum';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/pagination.interface';

@Injectable()
export class JobRepository extends Repository<Job> {
  //constructor(@InjectRepository(Job) private repo: Repository<Job>) {}
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
      throw new InternalServerErrorException(error);
    }
  }

  async getAllJobs(
    pageNo: number,
    noOfRecords: number,
    status: string,
  ): Promise<PaginatedResponse> {
    const take = noOfRecords || 10;
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    let queryBuilder = this.createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC')
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
  }

  async getNewJobs(): Promise<Job[]> {
    const job = this.find({ where: { status: JobStatus.NEW } });
    return job;
  }

  async getJob(jobId: string): Promise<Job> {
    const job: Job = await this.findOne({ where: { jobId: jobId } });

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
      throw new InternalServerErrorException(error);
    }
  }

  async updateSummary(jobId: string, data: any, sheetName: string) {
    try {
      const { rowsInserted, rowsRejected, rowsUpdated } = data;
      const entity = await this.getJob(jobId);

      if (!Array.isArray(entity.summary)) {
        entity.summary = [];
      }

      console.log(entity);
      // entity.rowsInserted += rowsInserted;
      // entity.rowsUpdated += rowsUpdated;
      // entity.rowsRejected += rowsRejected
      const updatedSummary = [
        ...entity.summary,
        { sheetName, rowsInserted, rowsUpdated, rowsRejected },
      ];

      entity.summary = updatedSummary;
      return this.save(entity);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
