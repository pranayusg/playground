import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { CreateBatchAssignmentOutlineDto } from './dto/create-batch-assignment-outline.dto';
import { UpdateBatchAssignmentOutlineDto } from './dto/update-batch-assignment-outline.dto';
import { BatchAssignmentOutline } from './entities/batch-assignment-outline.entity';
import { IGetUser } from 'src/auth/get-user.interface';
import { Role } from 'src/core/enum/role.enum';
import { BatchAssignmentOutlineActivityRepository } from './batch-assignment-outline-activity.repository';

@Injectable()
export class BatchAssignmentOutlineRepository extends Repository<BatchAssignmentOutline> {
  private logger = new Logger(BatchAssignmentOutlineRepository.name);
  constructor(
    private dataSource: DataSource,
    private batchAssignmentOutlineActivityRepo: BatchAssignmentOutlineActivityRepository,
  ) {
    super(BatchAssignmentOutline, dataSource.createEntityManager());
  }

  async createRecord(
    createBatchAssignmentOutlineDto: CreateBatchAssignmentOutlineDto,
    user: IGetUser,
  ): Promise<BatchAssignmentOutline> {
    try {
      const newData = this.create(createBatchAssignmentOutlineDto);
      const createdData = await this.save(newData);
      await this.batchAssignmentOutlineActivityRepo.createRecord(
        user?.username?.id,
        createdData.id,
        null,
        newData,
      );
      return createdData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchAssignmentOutlineRepository.name}/creteRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.assignmentOutlineId', 'assignmentOutline')
        .leftJoinAndSelect('entity.batchId', 'batch')
        .leftJoinAndSelect('assignmentOutline.techTrainingId', 'techTraining');

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `entity.${orderByValue}`,
          order === 'asc' ? OrderValue.ASC : OrderValue.DESC,
        );
      } else {
        queryBuilder
          .orderBy(
            `entity.${orderByValue}`,
            order === 'asc' ? OrderValue.ASC : OrderValue.DESC,
          )
          .take(take)
          .skip(skip);
      }

      if (user.role === Role.TRAINER) {
        const fullName = user.username.name;
        const firstName = fullName.split(' ')[0];

        queryBuilder = queryBuilder.andWhere(
          '(batch.headTrainer = :firstName OR batch.headTrainer = :fullName OR batch.trainingCoordinator = :firstName OR batch.trainingCoordinator = :fullName)',
          { firstName: firstName, fullName: fullName },
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
        `${BatchAssignmentOutlineRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<BatchAssignmentOutline> {
    const data = await this.findOne({
      where: { id: id },
      relations: { assignmentOutlineId: true, batchId: true },
    });

    if (!data) {
      throw new NotFoundException(
        `Batch Assignment Outline with ID: ${id} not found`,
      );
    }

    return data;
  }

  async updateData(
    id: string,
    updateBatchAssignmentOutlineDto: UpdateBatchAssignmentOutlineDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateBatchAssignmentOutlineDto);
      const updatedData = await this.save(updateData);
      await this.batchAssignmentOutlineActivityRepo.createRecord(
        user?.username?.id,
        id,
        originalData,
        updateData,
      );
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchAssignmentOutlineRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<BatchAssignmentOutline> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${BatchAssignmentOutlineRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
