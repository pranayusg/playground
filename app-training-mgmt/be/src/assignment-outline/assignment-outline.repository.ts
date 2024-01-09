import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { AssignmentOutline } from './entities/assignment-outline.entity';
import { CreateAssignmentOutlineDto } from './dto/create-assignment-outline.dto';
import { UpdateAssignmentOutlineDto } from './dto/update-assignment-outline.dto';
import { IGetUser } from 'src/auth/get-user.interface';
import { AssignmentOutlineActivityRepository } from './assignment-outline-activity.repository';

@Injectable()
export class AssignmentOutlineRepository extends Repository<AssignmentOutline> {
  private logger = new Logger(AssignmentOutlineRepository.name);
  constructor(
    private dataSource: DataSource,
    private assignmentOutlineActivityRepository: AssignmentOutlineActivityRepository,
  ) {
    super(AssignmentOutline, dataSource.createEntityManager());
  }

  async createRecord(
    createTechTrainingDto: CreateAssignmentOutlineDto,
    user: IGetUser,
  ): Promise<AssignmentOutline> {
    try {
      const newData = this.create(createTechTrainingDto);
      const createdData = await this.save(newData);
      await this.assignmentOutlineActivityRepository.createRecord(
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
        `${AssignmentOutlineRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    topic: string,
    tech: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.techTrainingId', 'techTraining')
        .leftJoinAndSelect('techTraining.techId', 'tech');

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

      if (topic) {
        queryBuilder = queryBuilder.andWhere('entity.topic ILIKE :topic', {
          topic: `%${topic}%`,
        });
      }
      if (tech) {
        queryBuilder = queryBuilder.andWhere('tech.name ILIKE :tech', {
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
        `${AssignmentOutlineRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<AssignmentOutline> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(
        `Assignment Outline with ID: ${id} not found`,
      );
    }

    return data;
  }

  async updateData(
    id: string,
    updateAssignmentOutlineDto: UpdateAssignmentOutlineDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };

      const updateData = Object.assign(data, updateAssignmentOutlineDto);
      const updatedData = await this.save(updateData);
      await this.assignmentOutlineActivityRepository.createRecord(
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
        `${AssignmentOutlineRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<AssignmentOutline> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${AssignmentOutlineRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
