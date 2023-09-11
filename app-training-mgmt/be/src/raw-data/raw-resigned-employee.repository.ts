import { Injectable } from '@nestjs/common';
import { RawResignedEmployee } from './entities/raw-resigned-employee.entity';
import { DataSource, Repository } from 'typeorm';
import { PaginatedResponse } from 'src/core/pagination.interface';

@Injectable()
export class RawResignedEmployeeRepository extends Repository<RawResignedEmployee> {
  constructor(private dataSource: DataSource) {
    super(RawResignedEmployee, dataSource.createEntityManager());
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    name: string,
  ): Promise<PaginatedResponse> {
    const take = noOfRecords || 10;
    const page = pageNo || 1;
    const skip = (page - 1) * take;

    let queryBuilder = this.createQueryBuilder('entity')
      .orderBy('entity.createdAt', 'DESC')
      .take(take)
      .skip(skip);

    if (name) {
      queryBuilder = queryBuilder.where('entity.employee ILIKE :name', {
        name: `%${name}%`,
      });
    }

    const [result, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / take);

    return {
      records: result,
      totalRecords: total,
      totalPages,
      currentPage: Number(page),
    };
  }
}
