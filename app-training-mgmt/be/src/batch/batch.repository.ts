import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CreateBatchDto } from './dto/create-batch.dto';
import { Batch } from './entities/batch.entity';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { CacheKeys } from 'src/core/constant/cache.constants';
import { IGetUser } from 'src/auth/get-user.interface';
import { Role } from 'src/core/enum/role.enum';
import { BatchActivityRepository } from './batch-activity.repository';

@Injectable()
export class BatchRepository extends Repository<Batch> {
  private logger = new Logger(BatchRepository.name);
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private batchActivityRepo: BatchActivityRepository,
  ) {
    super(Batch, dataSource.createEntityManager());
  }

  async createRecord(
    createBatchDto: CreateBatchDto,
    user: IGetUser,
  ): Promise<Batch> {
    try {
      const newBatch = this.create(createBatchDto);
      const createdBatch = await this.save(newBatch);
      await this.batchActivityRepo.createRecord(
        user?.username?.id,
        createdBatch.id,
        null,
        newBatch,
      );
      return createdBatch;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    } finally {
      await this.cacheManager.del(CacheKeys.BATCH_TECH);
      await this.cacheManager.del(CacheKeys.BATCH_STATUS);
      await this.cacheManager.del(CacheKeys.PARENT_BATCH);
      await this.cacheManager.del(CacheKeys.BATCH_TREE);
    }
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
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const actualOrderBy = orderBy || 'startDate';
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

      if (user.role === Role.TRAINER) {
        const fullName = user.username.name;
        const firstName = fullName.split(' ')[0];

        queryBuilder = queryBuilder.andWhere(
          '(entity.headTrainer = :firstName OR entity.headTrainer = :fullName OR entity.trainingCoordinator = :firstName OR entity.trainingCoordinator = :fullName)',
          { firstName: firstName, fullName: fullName },
        );
      }

      if (user.role === Role.TRAINEE) {
        queryBuilder
          .leftJoin('entity.trainingDetail', 'td')
          .leftJoin('td.empId', 'emp');
        queryBuilder = queryBuilder.andWhere('emp.id = :id', {
          id: user.username.id,
        });
      }

      if (status) {
        queryBuilder = queryBuilder.andWhere('entity.status ILIKE :status', {
          status: `${status}%`,
        });
      }
      if (tech) {
        queryBuilder = queryBuilder.andWhere(
          'entity.techTopic ILIKE :techTopic',
          {
            techTopic: `%${tech}%`,
          },
        );
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
        `${BatchRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<Batch> {
    const batch = await this.findOne({ where: { id: id } });

    if (!batch) {
      throw new NotFoundException(`Batch with ID: ${id} not found`);
    }

    return batch;
  }

  async updateData(id: string, UpdateBatchDto: UpdateBatchDto, user: IGetUser) {
    const batch = await this.getOne(id);
    try {
      const originalData = { ...batch };
      const updateBatch = Object.assign(batch, UpdateBatchDto);
      const updatedBatch = await this.save(updateBatch);
      await this.batchActivityRepo.createRecord(
        user?.username?.id,
        id,
        originalData,
        updatedBatch,
      );
      return updatedBatch;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    } finally {
      await this.cacheManager.del(CacheKeys.BATCH_TECH);
      await this.cacheManager.del(CacheKeys.BATCH_STATUS);
      await this.cacheManager.del(CacheKeys.PARENT_BATCH);
      await this.cacheManager.del(CacheKeys.BATCH_TREE);
    }
  }

  async deleteData(id: string): Promise<Batch> {
    const batch = await this.getOne(id);
    try {
      await this.delete(batch);
      return batch;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findBatch(
    batchType: string,
    batchTypeDescription: string,
    startDate: string,
  ): Promise<Batch> {
    try {
      const batch = await this.createQueryBuilder('batch')
        .where(
          '(batch.batch_title = :title1 AND batch.techTopic = :tech1) OR (batch.batch_title = :title2 AND batch.techTopic = :tech2)',
          {
            title1: batchType,
            tech1: batchTypeDescription,
            title2: batchTypeDescription,
            tech2: batchType,
            start_date: startDate,
          },
        )
        .getOne();
      return batch;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/findBatch`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getTech(trainer: boolean, user: IGetUser) {
    try {
      const queryBuilder = await this.createQueryBuilder('entity')
        .select('entity.techTopic', 'techTopic')
        .groupBy('entity.techTopic')
        .orderBy('entity.techTopic', OrderValue.ASC);

      if (trainer) {
        const fullName = user.username.name;
        const firstName = fullName.split(' ')[0];

        queryBuilder.andWhere(
          '(entity.headTrainer = :firstName OR entity.headTrainer = :fullName OR entity.trainingCoordinator = :firstName OR entity.trainingCoordinator = :fullName)',
          { firstName: firstName, fullName: fullName },
        );
      }

      const result = await queryBuilder.getRawMany();
      const techArray = result.map((result) => result.techTopic);

      return techArray;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/getTech`,
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
        `${BatchRepository.name}/getStatus`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBatchesWithChildrenValue(
    batchTitleString: string,
    techString: string,
  ): Promise<Batch> {
    try {
      const treeRepository = this.manager.getTreeRepository(Batch);

      const rootBatches = await treeRepository.findTrees();

      // Initialize an array to store batches with children having mentioned strings
      let batchesWithMentionedChildren = new Batch();

      // Recursive function to traverse the tree and find batches with mentioned strings children
      async function findBatchesWithChildren(batches: Batch[]) {
        for (const batch of batches) {
          // Check if the current batch has mentioned children
          if (
            batch.children &&
            batch.children.some((child) => child.techTopic === techString) &&
            batch.children.some(
              (child) => child.batchTitle === batchTitleString,
            )
          ) {
            batchesWithMentionedChildren = batch;
          }

          // Recursively call the function for the children of this batch
          if (batch.children) {
            await findBatchesWithChildren(batch.children);
          }
        }
      }

      // Start the search from the root batches
      await findBatchesWithChildren(rootBatches);

      return batchesWithMentionedChildren;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/getBatchesWithChildrenValue`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getParentBatches(trainer: boolean, user: any): Promise<Batch[]> {
    try {
      const treeRepository = this.manager.getTreeRepository(Batch);

      const trees = await treeRepository.findTrees();
      trees.sort((a, b) => a.batchTitle.localeCompare(b.batchTitle));

      if (trainer) {
        const fullName = user.username.name;
        const firstName = fullName.split(' ')[0];

        // Filter the trees array based on the conditions
        const filteredTrees = trees.filter((tree) => {
          return (
            tree.headTrainer === firstName ||
            tree.headTrainer === fullName ||
            tree.trainingCoordinator === firstName ||
            tree.trainingCoordinator === fullName
          );
        });

        // Remove 'children' property from each tree
        const modifiedTrees = this.removeChildrenObject(filteredTrees);

        return modifiedTrees;
      }

      const modifiedTrees = this.removeChildrenObject(trees);

      return modifiedTrees;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/getParentBatches`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  removeChildrenObject(tree: Batch[]) {
    try {
      const modifiedTrees = tree.map((tree) => {
        // Clone the tree object to avoid modifying the original object
        const clonedTree = { ...tree };

        // Delete the key-value pair you want to remove
        delete clonedTree['children'];

        return clonedTree;
      });
      return modifiedTrees;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/removeChildrenObject`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async countOfBatches(
    batchStatus: string,
    period: number,
    requiredDate: Date,
  ) {
    const batches = await this.getParentBatches(false, '');
    try {
      if (period !== 0) {
        const matchingBatches = batches.filter((batch) => {
          const batchCreationDate = batch.startDate;
          return (
            batch.status === batchStatus && batchCreationDate >= requiredDate
          );
        });

        const count = matchingBatches.length;
        let result: any[];

        if (count <= 10) {
          result = matchingBatches;
        } else {
          result = matchingBatches.slice(0, 10);
          result.push('...'); // Add ellipsis for more than 10 records
        }

        return { count, result };
      } else {
        const matchingBatches = batches.filter((batch) => {
          return batch.status === batchStatus;
        });

        const count = matchingBatches.length;
        let result: any[];

        if (count <= 10) {
          result = matchingBatches;
        } else {
          result = matchingBatches.slice(0, 10);
          result.push('...'); // Add ellipsis for more than 10 records
        }

        return { count, result };
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/countOfBatches`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBatchAsTree(): Promise<Batch[]> {
    try {
      const treeRepository = this.manager.getTreeRepository(Batch);

      const trees = await treeRepository.findTrees();
      return trees;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchRepository.name}/getBatchAsTree`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
