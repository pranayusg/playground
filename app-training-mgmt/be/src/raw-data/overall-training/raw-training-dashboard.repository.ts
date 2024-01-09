import { DataSource, Repository } from 'typeorm';
import { RawTrainingDashboard } from './entities/raw-training-dashboard.entity';
import { UpdateTrainingDashDto } from './dto/updateTrainingDash.dto';
import { TrainingDashDto } from './dto/training-dash.dto';
import {
  NotFoundException,
  InternalServerErrorException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';

@Injectable()
export class RawTrainingDashboardRepository extends Repository<RawTrainingDashboard> {
  private logger = new Logger(RawTrainingDashboardRepository.name);
  constructor(private dataSource: DataSource) {
    super(RawTrainingDashboard, dataSource.createEntityManager());
  }

  async createNewEntry(newData: TrainingDashDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawTrainingDashboardRepository.name}/createNewEntry`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    name: string,
    orderBy: string,
    order: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const actualOrderBy = orderBy || 'createdAt';
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

      if (name) {
        queryBuilder = queryBuilder.andWhere('entity.name ILIKE :name', {
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
        `${RawTrainingDashboardRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<RawTrainingDashboard> {
    const result = await this.findOne({ where: { empId: id } });

    if (!result) {
      throw new NotFoundException(`Data with ID: ${id} not found`);
    }
    return result;
  }

  async updateData(
    row: RawTrainingDashboard,
    updateTrainingDashDto: UpdateTrainingDashDto,
  ): Promise<RawTrainingDashboard> {
    try {
      const updateUserEntity = Object.assign(row, updateTrainingDashDto);
      const updatedUser = await this.save(updateUserEntity);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawTrainingDashboardRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findExisting(condition: any): Promise<RawTrainingDashboard[]> {
    try {
      const { empId, name, typeOfTraining, batchType, batchTypeDescription } =
        condition;

      const existing = this.find({
        where: {
          empId: empId,
          name: name,
          typeOfTraining: typeOfTraining,
          batchType: batchType,
          batchTypeDescription: batchTypeDescription,
        },
      });

      return existing;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawTrainingDashboardRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
