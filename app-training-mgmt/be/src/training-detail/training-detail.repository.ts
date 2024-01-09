import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TrainingDetail } from './entities/training-detail.entity';
import { CreateTrainingDetailDto } from './dto/create-training-detail.dto';
import { UpdateTrainingDetailDto } from './dto/update-training-detail.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { EmployeeStatus } from 'src/employee/employee-status.enum';
import { Role } from 'src/core/enum/role.enum';
import { IGetUser } from 'src/auth/get-user.interface';
import { TrainingDetailActivityRepository } from './training-detail-activity.repository';

@Injectable()
export class TrainingDetailRepository extends Repository<TrainingDetail> {
  private logger = new Logger(TrainingDetailRepository.name);
  constructor(
    private dataSource: DataSource,
    private trainingDetailActivityRepo: TrainingDetailActivityRepository,
  ) {
    super(TrainingDetail, dataSource.createEntityManager());
  }

  async createRecord(
    createTrainingDetailDto: CreateTrainingDetailDto,
    user: IGetUser,
  ): Promise<TrainingDetail> {
    try {
      const newData = this.create(createTrainingDetailDto);
      const createdData = await this.save(newData);
      await this.trainingDetailActivityRepo.createRecord(
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
        `${TrainingDetailRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
  async getAll(
    pageNo: number,
    noOfRecords: number,
    empName: string,
    supId: string,
    clientName: string,
    orderBy: string,
    order: string,
    user: IGetUser,
    batchStatus: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const actualOrderBy = orderBy || 'empId';
      let queryBuilder = this.createQueryBuilder('trainingDetail')
        .leftJoinAndSelect('trainingDetail.empId', 'emp')
        .leftJoinAndSelect('trainingDetail.batchId', 'batch');

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `trainingDetail.${actualOrderBy}`,
          order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
        );
      } else {
        queryBuilder
          .orderBy(
            `trainingDetail.${actualOrderBy}`,
            order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
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

      if (empName) {
        queryBuilder = queryBuilder.andWhere('emp.name ILIKE :name', {
          name: `%${empName}%`,
        });
      }

      if (supId) {
        queryBuilder = queryBuilder.andWhere('emp.reportingTo = :id', {
          id: supId,
        });
      }

      if (clientName) {
        queryBuilder = queryBuilder.andWhere('emp.currClient1 ILIKE :client', {
          client: `%${clientName}%`,
        });
      }

      if (batchStatus) {
        queryBuilder = queryBuilder.andWhere(
          'batch.status ILIKE :batchStatus',
          {
            batchStatus: `%${batchStatus}%`,
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
        `${TrainingDetailRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<TrainingDetail> {
    const query = this.createQueryBuilder('trainingDetail');
    const data = await query
      .leftJoinAndSelect('trainingDetail.empId', 'emp')
      .leftJoinAndSelect('trainingDetail.batchId', 'batch')
      .where('trainingDetail.id = :id', { id: id })
      .getOne();

    if (!data) {
      throw new NotFoundException(`Training Detail for ID: ${id} not found`);
    }

    return data;
  }

  async updateData(
    id: string,
    updateTrainingDetailDto: UpdateTrainingDetailDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };

      const updateData = Object.assign(data, updateTrainingDetailDto);
      const updatedData = await this.save(updateData);
      await this.trainingDetailActivityRepo.createRecord(
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
        `${TrainingDetailRepository.name}/updaeData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<TrainingDetail> {
    try {
      const data = await this.getOne(id);

      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TrainingDetailRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findExisting(batchId: string, empId: string): Promise<TrainingDetail> {
    try {
      const query = this.createQueryBuilder('trainingDetail');
      const data = await query
        .leftJoinAndSelect('trainingDetail.empId', 'emp')
        .leftJoinAndSelect('trainingDetail.batchId', 'batch')
        .andWhere('batch.id = :batchId', { batchId: batchId })
        .andWhere('emp.id = :empId', { empId: empId })
        .getOne();
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TrainingDetailRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async countOfTraining(period: number, requiredDate: Date) {
    try {
      const query = this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.batchId', 'batch')
        .leftJoinAndSelect('entity.empId', 'emp');
      let formattedResult = [];
      if (period !== 0) {
        const [result, count] = await query
          .andWhere('batch.startDate >= :requiredDate', {
            requiredDate: requiredDate,
          })
          .orderBy('emp.name', OrderValue.ASC)
          .take(10)
          .getManyAndCount();

        if (count > 10) {
          formattedResult = result;
          formattedResult.push('...');
          return { count, result: formattedResult };
        }

        return { count, result };
      } else {
        const [result, count] = await query
          .orderBy('emp.name', OrderValue.ASC)
          .take(10)
          .getManyAndCount();

        if (count > 10) {
          formattedResult = result;
          formattedResult.push('...');
          return { count, result: formattedResult };
        }

        return { count, result };
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TrainingDetailRepository.name}/countOfTraining`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getBatchEmployees(id: string) {
    try {
      const query = this.createQueryBuilder('trainingDetail');
      const data = await query
        .leftJoinAndSelect('trainingDetail.empId', 'emp')
        .leftJoinAndSelect('trainingDetail.batchId', 'batch')
        .andWhere('batch.id = :batchId', { batchId: id })
        .andWhere('batch.headTrainer NOT ILIKE :status', {
          status: '%Self Learning%',
        })
        .andWhere('emp.status = :empStatus', {
          empStatus: EmployeeStatus.Active,
        })
        .getMany();
      if (!data) {
        throw new NotFoundException(`Employees for Batch ID: ${id} not found`);
      }
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TrainingDetailRepository.name}/getBatchEmployees`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
