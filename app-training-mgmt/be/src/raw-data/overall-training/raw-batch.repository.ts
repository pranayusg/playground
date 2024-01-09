import { DataSource, Repository } from 'typeorm';
import { RawBatch } from './entities/raw-batch.entity';
import { BatchesDto } from './dto/createBatches.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { UpdateBatchesDto } from '../overall-training/dto/updateBatches.dto';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { OrderValue } from 'src/core/enum/order.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/core/constant/cache.constants';

@Injectable()
export class RawBatchRepository extends Repository<RawBatch> {
  private logger = new Logger(RawBatchRepository.name);
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(RawBatch, dataSource.createEntityManager());
  }

  async createNewEntry(newData: BatchesDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawBatchRepository.name}/createNewEntry`,
      );
      throw new error();
    } finally {
      await this.cacheManager.del(CacheKeys.RAW_BATCH_TECH);
      await this.cacheManager.del(CacheKeys.RAW_BATCH_STATUS);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    status: string,
    tech: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const actualOrderBy = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity');

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `entity.${actualOrderBy}`,
          order === 'asc' ? OrderValue.ASC : OrderValue.DESC,
        );
      } else {
        queryBuilder
          .orderBy(
            `entity.${actualOrderBy}`,
            order === 'asc' ? OrderValue.ASC : OrderValue.DESC,
          )
          .take(take)
          .skip(skip);
      }

      if (status) {
        queryBuilder = queryBuilder.andWhere('entity.status ILIKE :status', {
          status: `${status}%`,
        });
      }
      if (tech) {
        queryBuilder = queryBuilder.andWhere('entity.tech ILIKE :tech', {
          tech: `%${tech}%`,
        });
      }

      if (pageNo == 0) {
        const res = await queryBuilder.getMany();
        return { records: res };
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
        `${RawBatchRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTech() {
    try {
      const queryBuilder = await this.createQueryBuilder('entity')
        .select('entity.tech', 'tech')
        .groupBy('entity.tech')
        .orderBy('entity.tech', OrderValue.ASC)
        .getRawMany();
      const techArray = queryBuilder.map((result) => result.tech);

      return techArray;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawBatchRepository.name}/getTech`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getStatus() {
    try {
      const queryBuilder = await this.createQueryBuilder('entity')
        .select('entity.status', 'status')
        .groupBy('entity.status')
        .orderBy('entity.status', OrderValue.ASC)
        .getRawMany();
      const statusArray = queryBuilder.map((result) => result.status);

      return statusArray;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawBatchRepository.name}/getStatus`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<RawBatch> {
    const result = await this.findOne({ where: { id: id } });

    return result;
  }

  async updateData(
    row: RawBatch,
    updateBatchesDto: UpdateBatchesDto,
  ): Promise<RawBatch> {
    try {
      const updateUserEntity = Object.assign(row, updateBatchesDto);
      const updatedUser = await this.save(updateUserEntity);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawBatchRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    } finally {
      await this.cacheManager.del(CacheKeys.RAW_BATCH_TECH);
      await this.cacheManager.del(CacheKeys.RAW_BATCH_STATUS);
    }
  }

  async findExisting(conditions: any): Promise<RawBatch[]> {
    try {
      const { batchTitle, tech, startDate, trainingCoordinator, headTrainer } =
        conditions;

      const existing = this.find({
        where: {
          batchTitle: batchTitle,
          tech: tech,
          startDate: startDate,
          trainingCoordinator: trainingCoordinator,
          headTrainer: headTrainer,
        },
      });

      return existing;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawBatchRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
