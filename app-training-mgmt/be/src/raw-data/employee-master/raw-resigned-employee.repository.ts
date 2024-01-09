import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { RawResignedEmployee } from './entities/raw-resigned-employee.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateRawEmployeeDto } from './dto/create-raw-active-employee.dto';
import { UpdateRawEmployeeDto } from './dto/update-raw-active-employee.dto';
import { OrderValue } from 'src/core/enum/order.enum';

@Injectable()
export class RawResignedEmployeeRepository extends Repository<RawResignedEmployee> {
  private logger = new Logger(RawResignedEmployeeRepository.name);
  constructor(private dataSource: DataSource) {
    super(RawResignedEmployee, dataSource.createEntityManager());
  }

  async createNewEntry(newData: CreateRawEmployeeDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawResignedEmployeeRepository.name}/createNewEntry`,
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
        queryBuilder = queryBuilder.where('entity.employee ILIKE :name', {
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
        `${RawResignedEmployeeRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateData(
    row: RawResignedEmployee,
    updateTrainingDashDto: UpdateRawEmployeeDto,
  ): Promise<RawResignedEmployee> {
    try {
      const updateUserEntity = Object.assign(row, updateTrainingDashDto);
      const updatedUser = await this.save(updateUserEntity);
      return updatedUser;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawResignedEmployeeRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findExisting(conditions: any): Promise<RawResignedEmployee[]> {
    try {
      const { employeeNumber } = conditions;

      const existing = this.find({
        where: {
          employeeNumber: employeeNumber,
        },
      });

      return existing;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${RawResignedEmployeeRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
