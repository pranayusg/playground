import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { TechTraining } from './entities/tech_training.entity';
import { CreateTechTrainingDto } from './dto/create-tech-training.dto';
import { UpdateTechTrainingDto } from './dto/update-tech-training.dto';
import { IGetUser } from 'src/auth/get-user.interface';
import { TechTrainingActivityRepository } from './tech-training-activity.repository';

@Injectable()
export class TechTrainingRepository extends Repository<TechTraining> {
  private logger = new Logger(TechTrainingRepository.name);
  constructor(
    private dataSource: DataSource,
    private techTrainingActivityRepo: TechTrainingActivityRepository,
  ) {
    super(TechTraining, dataSource.createEntityManager());
  }

  async createRecord(
    createTechTrainingDto: CreateTechTrainingDto,
    user: IGetUser,
  ): Promise<TechTraining> {
    try {
      const newData = this.create(createTechTrainingDto);
      const createdData = await this.save(newData);
      await this.techTrainingActivityRepo.createRecord(
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
        `${TechTrainingRepository.name}/CreateRecord`,
      );
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    tech: string,
    topic: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity').leftJoinAndSelect(
        'entity.techId',
        'tech',
      );

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

      if (tech) {
        queryBuilder = queryBuilder.where('tech.name ILIKE :tech', {
          tech: `%${tech}%`,
        });
      }

      if (topic) {
        queryBuilder = queryBuilder.andWhere('entity.topic ILIKE :topic', {
          topic: `%${topic}%`,
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
        `${TechTrainingRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<TechTraining> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Tech Training with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(
    id: string,
    updateTechTrainingDto: UpdateTechTrainingDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateTechTrainingDto);
      const updatedData = await this.save(updateData);
      await this.techTrainingActivityRepo.createRecord(
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
        `${TechTrainingRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<TechTraining> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TechTrainingRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
