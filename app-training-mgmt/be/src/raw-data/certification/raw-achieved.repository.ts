import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RawAchieved } from './entities/raw-achieved.entity';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateAchievedDto } from './dto/create-achieved.dto';
import { UpdateAchievedDto } from './dto/update-achieved.dto';
import { OrderValue } from 'src/core/enum/order.enum';

@Injectable()
export class RawAchievedRepository extends Repository<RawAchieved> {
  private logger = new Logger(RawAchievedRepository.name);
  constructor(private dataSource: DataSource) {
    super(RawAchieved, dataSource.createEntityManager());
  }

  async createNewEntry(newData: CreateAchievedDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawAchievedRepository.name}/createNewEntry`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
    certification: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';

      let queryBuilder = this.createQueryBuilder('entity');

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
        queryBuilder = queryBuilder.where('entity.name ILIKE :name', {
          name: `%${name}%`,
        });
      }

      if (certification) {
        queryBuilder = queryBuilder.andWhere(
          'entity.certification ILIKE :certification',
          {
            certification: `%${certification}%`,
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
        `${RawAchievedRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<RawAchieved> {
    const result = await this.findOne({ where: { empId: id } });

    if (!result) {
      throw new NotFoundException(`Data with ID: ${id} not found`);
    }
    return result;
  }

  async updateData(
    row: RawAchieved,
    updateTrainingDashDto: UpdateAchievedDto,
  ): Promise<RawAchieved> {
    try {
      const updateUserEntity = Object.assign(row, updateTrainingDashDto);
      const updatedUser = await this.save(updateUserEntity);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawAchievedRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findExisting(conditions: any): Promise<RawAchieved[]> {
    try {
      const { empId, name, certification, level, exam } = conditions;

      const existing = this.find({
        where: {
          empId: empId,
          name: name,
          certification: certification,
          level: level,
          exam: exam,
        },
      });

      return existing;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawAchievedRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
