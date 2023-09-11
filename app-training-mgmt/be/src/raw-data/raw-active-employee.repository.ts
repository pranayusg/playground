import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateRawActiveEmployeeDto } from './dto/update-raw-active-employee.dto';
import { RawActiveEmployee } from './entities/raw-active-employee.entity';
import { PaginatedResponse } from 'src/core/pagination.interface';
import { CreateRawActiveEmployeeDto } from './dto/create-raw-active-employee.dto';

@Injectable()
export class RawActiveEmployeeRepository extends Repository<RawActiveEmployee> {
  constructor(private dataSource: DataSource) {
    super(RawActiveEmployee, dataSource.createEntityManager());
  }

  async createNewEntry(newData: CreateRawActiveEmployeeDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
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

  async getOne(id: string): Promise<RawActiveEmployee> {
    const result = await this.findOne({ where: { employeeNumber: id } });

    if (!result) {
      throw new NotFoundException(`Data with ID: ${id} not found`);
    }
    return result;
  }

  async updateData(
    row: RawActiveEmployee,
    updateTrainingDashDto: UpdateRawActiveEmployeeDto,
  ): Promise<RawActiveEmployee> {
    try {
      const updateUserEntity = Object.assign(row, updateTrainingDashDto);
      const updatedUser = await this.save(updateUserEntity);
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async findExisting(condition: any): Promise<ExcelSheetActiveEmployees[]> {
  //   const { empId, doj, typeOfTraining, batchType, batchTypeDescription } =
  //     condition;

  //   const existing = this.repo.find({
  //     where: {
  //       employeeNumber: empId,
  //       doj: doj,
  //       typeOfTraining: typeOfTraining,
  //       batchType: batchType,
  //       batchTypeDescription: batchTypeDescription,
  //     },
  //   });

  //   return existing;
  // }
}
