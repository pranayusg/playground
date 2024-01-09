import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { FeedbackAssignment } from './entities/feedback-assignment.entity';
import { CreateFeedbackAssignmentDto } from './dto/create-feedback-assignment.dto';
import { UpdateFeedbackAssignmentDto } from './dto/update-feedback-assignment.dto';
import { IGetUser } from 'src/auth/get-user.interface';
import { Role } from 'src/core/enum/role.enum';
import { FeedbackAssignmentActivityRepository } from './feedback-assignment-activity.repository';

@Injectable()
export class FeedbackAssignmentRepository extends Repository<FeedbackAssignment> {
  private logger = new Logger(FeedbackAssignmentRepository.name);
  constructor(
    private dataSource: DataSource,
    private feedbackAssignmentActivityrepo: FeedbackAssignmentActivityRepository,
  ) {
    super(FeedbackAssignment, dataSource.createEntityManager());
  }

  async createRecord(
    createFeedbackAssignmentDto: CreateFeedbackAssignmentDto,
    user: IGetUser,
  ): Promise<FeedbackAssignment> {
    try {
      const newData = this.create(createFeedbackAssignmentDto);
      const createdData = await this.save(newData);
      await this.feedbackAssignmentActivityrepo.createRecord(
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
        `${FeedbackAssignmentRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    employee: string,
    status: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity')
        .leftJoinAndSelect(
          'entity.batchAssignmentOutlineId',
          'batchAssignmentOutline',
        )
        .leftJoinAndSelect(
          'batchAssignmentOutline.assignmentOutlineId',
          'assignmentoutline',
        )
        .leftJoinAndSelect('entity.empId', 'employee')
        .leftJoinAndSelect('batchAssignmentOutline.batchId', 'batch');

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

      if (user.role === Role.TRAINEE) {
        queryBuilder = queryBuilder.andWhere('employee.id = :id', {
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

      if (employee) {
        queryBuilder.andWhere('employee.name ILIKE :name', {
          name: `%${employee}%`,
        });
      }

      if (status) {
        queryBuilder.andWhere('entity.status = :status', {
          status: status,
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
        `${FeedbackAssignmentRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<FeedbackAssignment> {
    const queryBuilder = this.createQueryBuilder('entity')
      .leftJoinAndSelect(
        'entity.batchAssignmentOutlineId',
        'batchAssignmentOutline',
      )
      .leftJoinAndSelect(
        'batchAssignmentOutline.assignmentOutlineId',
        'assignmentoutline',
      )
      .leftJoinAndSelect('entity.empId', 'employee')
      .where('entity.id = :id', { id: id });

    const data = await queryBuilder.getOne();

    if (!data) {
      throw new NotFoundException(
        `Feedback Assignment with ID: ${id} not found`,
      );
    }

    return data;
  }

  async updateData(
    id: string,
    updateFeedbackAssignmentDto: UpdateFeedbackAssignmentDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateFeedbackAssignmentDto);
      const updatedData = await this.save(updateData);
      await this.feedbackAssignmentActivityrepo.createRecord(
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
        `${FeedbackAssignmentRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<FeedbackAssignment> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${FeedbackAssignmentRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
