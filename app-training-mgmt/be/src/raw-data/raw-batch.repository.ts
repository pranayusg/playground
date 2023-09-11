import { DataSource, Repository } from 'typeorm';
import { RawBatch } from './entities/raw-batch.entity';
import { BatchesDto } from './dto/createBatches.dto';
import { PaginatedResponse } from 'src/core/pagination.interface';
import { UpdateBatchesDto } from './dto/updateBatches.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RawBatchRepository extends Repository<RawBatch> {
  constructor(private dataSource: DataSource) {
    super(RawBatch, dataSource.createEntityManager());
  }

  async createNewEntry(newData: BatchesDto) {
    try {
      const newRow = this.create(newData);
      await this.save(newRow);
    } catch (error) {
      throw new error();
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    status: string,
    tech: string,
  ): Promise<PaginatedResponse | RawBatch[]> {
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
      actualOrderBy === 'headTrainer' ||
      actualOrderBy === 'trainingCoordinator'
    ) {
      order = 'ASC';
    } else {
      order = 'DESC';
    }

    let queryBuilder = this.createQueryBuilder('entity')
      .orderBy(`entity.${actualOrderBy}`, order === 'ASC' ? 'ASC' : 'DESC')
      .take(take)
      .skip(skip);

    if (status || tech) {
      queryBuilder = queryBuilder.where((builder) => {
        if (status) {
          builder.andWhere('entity.status ILIKE :status', {
            status: `%${status}%`,
          });
        }
        if (tech) {
          builder.andWhere('entity.tech ILIKE :tech', {
            tech: `%${tech}%`,
          });
        }
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

  async getTech() {
    const queryBuilder = await this.createQueryBuilder('entity')
      .select('entity.tech', 'tech')
      .groupBy('entity.tech')
      .orderBy('entity.tech', 'ASC')
      .getRawMany();
    const techArray = queryBuilder.map((result) => result.tech);

    return techArray;
  }

  async getOne(id: string): Promise<RawBatch> {
    const result = await this.findOne({ where: { id: id } });
    return result;
  }

  async updateData(
    row: RawBatch,
    updateBatchesDto: UpdateBatchesDto,
  ): Promise<RawBatch> {
    const updateUserEntity = Object.assign(row, updateBatchesDto);
    const updatedUser = await this.save(updateUserEntity);
    return updatedUser;
  }

  async findExisting(conditions: any): Promise<RawBatch[]> {
    const { batchTitle, tech, startDate, trainingCoordinator, headTrainer } =
      conditions;

    const existing = this.find({
      where: {
        batchTitle: batchTitle,
        tech: tech,
        startDate: startDate,
        trainingCoordinator: trainingCoordinator,
        headTrainer: headTrainer,
      },
    });

    return existing;
  }
}
