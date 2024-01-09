import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { BatchRepository } from './batch.repository';
import { CreateBatchDto } from './dto/create-batch.dto';
import { Batch } from './entities/batch.entity';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { RawBatchRepository } from 'src/raw-data/overall-training/raw-batch.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { NO_DATA_MESSAGE } from 'src/core/constant/constatnts';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/core/constant/cache.constants';
import { ConfigService } from '@nestjs/config';
import { IGetUser } from 'src/auth/get-user.interface';
import { CACHE_TTL_ENV } from 'src/core/constant/env.constant';

@Injectable()
export class BatchService {
  private logger = new Logger(BatchService.name);
  constructor(
    private batchRepository: BatchRepository,
    private rawBatchRepo: RawBatchRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private configService: ConfigService,
  ) {}
  private CACHE_TTL = Number(this.configService.get<number>(CACHE_TTL_ENV));

  async createBatch(
    createBatchDto: CreateBatchDto,
    user: IGetUser,
  ): Promise<Batch> {
    return await this.batchRepository.createRecord(createBatchDto, user);
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    status: string,
    tech: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    return await this.batchRepository.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      status,
      tech,
      user,
    );
  }

  async getOne(id: string): Promise<Batch> {
    return await this.batchRepository.getOne(id);
  }

  async updateData(
    id: string,
    updateBatchDto: UpdateBatchDto,
    user: IGetUser,
  ): Promise<Batch> {
    return await this.batchRepository.updateData(id, updateBatchDto, user);
  }

  async deleteData(id: string): Promise<Batch> {
    return await this.batchRepository.deleteData(id);
  }

  async getTech(trainer: boolean, user: IGetUser) {
    return await this.batchRepository.getTech(trainer, user);
  }

  async getStatus() {
    let value = await this.cacheManager.get(CacheKeys.BATCH_STATUS);
    if (value) {
      return value;
    } else {
      value = await this.batchRepository.getStatus();
      await this.cacheManager.set(
        CacheKeys.BATCH_STATUS,
        value,
        this.CACHE_TTL,
      );
      return value;
    }
  }

  async transferRawData() {
    try {
      const rawBatches = await this.rawBatchRepo.find({
        where: { isProcessed: false },
      });
      if (rawBatches.length === 0) {
        this.logger.log(NO_DATA_MESSAGE);
        return { message: NO_DATA_MESSAGE };
      }
      const newData: CreateBatchDto = new CreateBatchDto();

      for (const data of rawBatches) {
        const existingRecord = await this.batchRepository.findOne({
          where: {
            batchTitle: data.batchTitle.trimEnd(),
            techTopic: data.tech.trimEnd(),
            startDate: data.startDate,
          },
        });

        if (existingRecord) {
          // Compare other columns and update if any are different
          if (
            existingRecord.trainingCoordinator !== data.trainingCoordinator ||
            existingRecord.headTrainer !== data.headTrainer ||
            existingRecord.status !== data.status ||
            existingRecord.noOfTrainees !== data.noOfTrainees
          ) {
            await this.batchRepository.updateData(
              existingRecord.id,
              {
                trainingCoordinator: data.trainingCoordinator,
                headTrainer: data.headTrainer,
                status: data.status,
                noOfTrainees: data.noOfTrainees,
              },
              null,
            );
          }
        } else {
          newData.batchTitle = data.batchTitle.trimEnd();
          newData.techTopic = data.tech.trimEnd();
          newData.startDate = data.startDate;
          newData.endDate = data.endDate;
          newData.trainingCoordinator = data.trainingCoordinator;
          newData.headTrainer = data.headTrainer;
          newData.status = data.status;
          newData.noOfTrainees = data.noOfTrainees;

          await this.batchRepository.createRecord(newData, null);
        }
        await this.rawBatchRepo.updateData(data, {
          isProcessed: true,
        });
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchService.name}/transferRawData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getParentBatches(trainer: boolean, user: IGetUser): Promise<Batch[]> {
    return await this.batchRepository.getParentBatches(trainer, user);
  }

  async getNoOfBatchesForStatus(
    batchStatus: string,
    period: number,
    requiredDate: Date,
  ) {
    return this.batchRepository.countOfBatches(
      batchStatus,
      period,
      requiredDate,
    );
  }

  async getbatchVsStrength(period: number, requiredDate: Date) {
    const batches = await this.batchRepository.getParentBatches(false, '');
    try {
      const result = {};
      if (period !== 0) {
        batches.forEach((batch) => {
          // Assuming you have properties like batchTitle and noOfTrainees in your batch object
          const { noOfTrainees, techTopic, startDate } = batch;

          if (startDate >= requiredDate && noOfTrainees != null) {
            result[techTopic] = noOfTrainees;
          }
        });
        return result;
      } else {
        batches.forEach((batch) => {
          // Assuming you have properties like batchTitle and noOfTrainees in your batch object
          const { noOfTrainees, techTopic } = batch;

          if (noOfTrainees != null) {
            result[techTopic] = noOfTrainees;
          }
        });
        return result;
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchService.name}/getbatchVsStrength`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBatchesAsTree(trainer: boolean, user: any): Promise<Batch[]> {
    const batches = await this.batchRepository.getBatchAsTree();
    try {
      batches.sort((a, b) => {
        // Use localeCompare for case-insensitive sorting
        return a.batchTitle.localeCompare(b.batchTitle);
      });

      if (trainer) {
        const fullName = user.username.name;
        const firstName = fullName.split(' ')[0];

        // Filter the batches array based on the conditions
        const filteredBatches = batches.filter((batch) => {
          return (
            batch.headTrainer === firstName ||
            batch.headTrainer === fullName ||
            batch.trainingCoordinator === firstName ||
            batch.trainingCoordinator === fullName
          );
        });

        return filteredBatches;
      }

      return batches;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchService.name}/getBatchesAsTree`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getParentChildBatchIds(batchId: string) {
    const batchIds = [];
    const batches = await this.getBatchesAsTree(false, '');
    for (const batch of batches) {
      if (batch.id === batchId) {
        if (batch.children.length === 0) {
          batchIds.push(batch.id);
        } else {
          const matchedChildren = batch.children.map((item) => item.id);
          batchIds.push(...matchedChildren);
        }
      } else {
        const matchedChild = batch.children.filter(
          (item) => item.id === batchId,
        );
        if (matchedChild.length > 0) {
          batchIds.push(matchedChild[0].id);
        }
      }
    }
    return batchIds;
  }
}
