import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { CreateFeedbackTraineesBatchDto } from './dto/create-feedback-trainees-batch.dto';
import { UpdateFeedbackTraineesBatchDto } from './dto/update-feedback-trainees-batch.dto';
import { FeedbackTraineesBatch } from './entities/feedback-trainees-batch.entity';
import { IGetUser } from 'src/auth/get-user.interface';
import { Role } from 'src/core/enum/role.enum';
import { FORM_ALREADY_SUBMITTED } from 'src/core/constant/constatnts';
import { FeedbackTraineesBatchActivityRepository } from './feedback-trainees-batch-activity.repository';

@Injectable()
export class FeedbackTraineesBatchRepository extends Repository<FeedbackTraineesBatch> {
  private logger = new Logger(FeedbackTraineesBatchRepository.name);
  constructor(
    private dataSource: DataSource,
    private feedbackTraineesBatchActivity: FeedbackTraineesBatchActivityRepository,
  ) {
    super(FeedbackTraineesBatch, dataSource.createEntityManager());
  }

  async createRecord(
    createFeedbackTraineesBatchDto: CreateFeedbackTraineesBatchDto,
    user: IGetUser,
  ): Promise<FeedbackTraineesBatch> {
    try {
      const newData = this.create(createFeedbackTraineesBatchDto);
      const createdData = await this.save(newData);
      await this.feedbackTraineesBatchActivity.createRecord(
        user?.username?.id,
        createdData.id,
        null,
        newData,
      );
      return createdData;
    } catch (error) {
      if (error.code === '23505') {
        throw new BadRequestException(FORM_ALREADY_SUBMITTED);
      }
      this.logger.error(
        error.message,
        error.stack,
        `${FeedbackTraineesBatchRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    batchIds: string[],
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.questionId', 'question')
        .leftJoinAndSelect('entity.answerOptionId', 'option')
        .leftJoinAndSelect('entity.batchId', 'batch')
        .leftJoinAndSelect('entity.empId', 'emp');

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `entity.${orderByValue}`,
          order === 'asc' ? OrderValue.ASC : OrderValue.DESC,
        );
      } else {
        queryBuilder.orderBy(
          `entity.${orderByValue}`,
          order === 'asc' ? OrderValue.ASC : OrderValue.DESC,
        );
      }

      if (user.role === Role.TRAINEE) {
        queryBuilder = queryBuilder.andWhere('emp.id = :id', {
          id: user.username.id,
        });
      }

      if (user.role === Role.TRAINER) {
        const fullName = user.username.name;
        const firstName = fullName.split(' ')[0];

        queryBuilder = queryBuilder.andWhere(
          '(batch.headTrainer = :firstName OR batch.headTrainer = :fullName OR batch.trainingCoordinator = :firstName OR batch.trainingCoordinator = :fullName)',
          { firstName: firstName, fullName: fullName },
        );
      }

      if (batchIds && batchIds.length > 0) {
        queryBuilder.andWhere('batch.id IN (:...batchIds)', { batchIds });
      }

      if (pageNo == 0) {
        const res = await queryBuilder.getMany();
        return { records: res };
      }

      const result = await queryBuilder.getMany();

      // Grouping by empId and batchId
      const groupedResult = result.reduce((acc, curr) => {
        const key = `${curr.empId.id}-${curr.batchId.id}`;
        if (!acc[key]) {
          acc[key] = {
            empId: curr.empId,
            batchId: curr.batchId,
            feedback: [],
          };
        }
        acc[key].feedback.push({
          answertext: curr.answerText,
          questionId: curr.questionId,
          answerOptionId: curr.answerOptionId,
        });
        return acc;
      }, {});

      let records = Object.values(groupedResult);
      const total = records.length;
      const totalPages = Math.ceil(total / take);

      records = records.slice(skip, skip + take);

      if (pageNo == 0) {
        return { records };
      }

      return {
        records,
        totalRecords: total,
        totalPages,
        currentPage: Number(page),
      };
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${FeedbackTraineesBatchRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<FeedbackTraineesBatch> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Tech Training with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(
    id: string,
    updateFeedbackTraineesBatchDto: UpdateFeedbackTraineesBatchDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };

      const updateData = Object.assign(data, updateFeedbackTraineesBatchDto);
      const updatedData = await this.save(updateData);
      await this.feedbackTraineesBatchActivity.createRecord(
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
        `${FeedbackTraineesBatchRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<FeedbackTraineesBatch> {
    const data = await this.getOne(id);
    try {
      await this.softDelete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${FeedbackTraineesBatchRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
