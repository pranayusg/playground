import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RawOngoing } from './entities/raw-ongoing.entity';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateOnGoingDto } from './dto/create-ongoing.dto';
import { UpdateOnGoingDto } from './dto/update-ongoing.dto';
import { OrderValue } from 'src/core/enum/order.enum';

@Injectable()
export class RawOnGoingRepository extends Repository<RawOngoing> {
  private logger = new Logger(RawOnGoingRepository.name);
  constructor(private dataSource: DataSource) {
    super(RawOngoing, dataSource.createEntityManager());
  }

  async createNewEntry(newData: CreateOnGoingDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawOnGoingRepository.name}/createNewEntry`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    firstName: string,
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

      if (firstName) {
        queryBuilder = queryBuilder.where('entity.first_name ILIKE :name', {
          name: `%${firstName}%`,
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
        `${RawOnGoingRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<RawOngoing> {
    const result = await this.findOne({ where: { empId: id } });

    if (!result) {
      throw new NotFoundException(`Data with ID: ${id} not found`);
    }
    return result;
  }

  async updateData(
    row: RawOngoing,
    updateTrainingDashDto: UpdateOnGoingDto,
  ): Promise<RawOngoing> {
    try {
      const updateUserEntity = Object.assign(row, updateTrainingDashDto);
      const updatedUser = await this.save(updateUserEntity);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawOnGoingRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findExisting(conditions: any): Promise<RawOngoing[]> {
    try {
      const { empId, firstName, certification, exam } = conditions;

      const existing = this.find({
        where: {
          empId: empId,
          firstName: firstName,
          certification: certification,
          exam: exam,
        },
      });

      return existing;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawOnGoingRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
