import { DataSource, Repository } from 'typeorm';
import { RawTrainingDashboard } from './entities/raw-training-dashboard.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateTrainingDashDto } from './dto/updateTrainingDash.dto';
import { TrainingDashDto } from './dto/training-dash.dto';
import {
  NotFoundException,
  InternalServerErrorException,
  Injectable,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/pagination.interface';

@Injectable()
export class RawTrainingDashboardRepository extends Repository<RawTrainingDashboard> {
  constructor(private dataSource: DataSource) {
    super(RawTrainingDashboard, dataSource.createEntityManager());
  }

  async createNewEntry(newData: TrainingDashDto) {
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
    orderBy: string,
  ): Promise<PaginatedResponse | RawTrainingDashboard[]> {
    if (pageNo == 0) {
      const res = await this.find();
      return res;
    }
    const take = noOfRecords || 10;
    const page = pageNo || 1;
    const skip = (page - 1) * take;
    const actualOrderBy = orderBy || 'createdAt';
    let order = 'ASC' || 'DESC';

    if (
      actualOrderBy === 'trainingStartDate' ||
      actualOrderBy === 'trainingEndDate' ||
      actualOrderBy === 'doj' ||
      actualOrderBy === 'updatedAt' ||
      actualOrderBy === 'createdAt'
    ) {
      order = 'DESC';
    } else {
      order = 'ASC';
    }

    let queryBuilder = this.createQueryBuilder('entity')
      .orderBy(`entity.${actualOrderBy}`, order === 'ASC' ? 'ASC' : 'DESC')
      .take(take)
      .skip(skip);

    if (name) {
      queryBuilder = queryBuilder.where('entity.name ILIKE :name', {
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
      throw new InternalServerErrorException(error);
    }
  }

  async findExisting(condition: any): Promise<RawTrainingDashboard[]> {
    const { empId, doj, typeOfTraining, batchType, batchTypeDescription } =
      condition;

    const existing = this.find({
      where: {
        empId: empId,
        doj: doj,
        typeOfTraining: typeOfTraining,
        batchType: batchType,
        batchTypeDescription: batchTypeDescription,
      },
    });

    return existing;
  }
}
