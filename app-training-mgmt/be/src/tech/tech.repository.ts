import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { Tech } from './entities/tech.entity';
import { TechActivityRepository } from './tech-activity.repository';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class TechRepository extends Repository<Tech> {
  private logger = new Logger(TechRepository.name);
  constructor(
    private dataSource: DataSource,
    private techActivityRepo: TechActivityRepository,
  ) {
    super(Tech, dataSource.createEntityManager());
  }

  async createRecord(
    createTechDto: CreateTechDto,
    user: IGetUser,
  ): Promise<Tech> {
    try {
      const newData = this.create(createTechDto);
      const createdData = await this.save(newData);
      await this.techActivityRepo.createRecord(
        user?.username?.id,
        createdData.id,
        null,
        newData,
      );
      return createdData;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      const queryBuilder = this.createQueryBuilder('entity');

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

      if (name) {
        queryBuilder.andWhere('entity.name ILIKE :name', {
          name: `%${name}%`,
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
        `${TechRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<Tech> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Tech with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(id: string, updateTechDto: UpdateTechDto, user: IGetUser) {
    const data = await this.getOne(id);
    try {
      // Create a copy of the data to capture the original state
      const originalData = { ...data };

      const updateData = Object.assign(data, updateTechDto);
      const updatedData = await this.save(updateData);
      await this.techActivityRepo.createRecord(
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
        `${TechRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<Tech> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${TechRepository.name}/DeleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
