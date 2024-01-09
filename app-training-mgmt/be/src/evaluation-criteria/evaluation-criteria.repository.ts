import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { Repository, DataSource } from 'typeorm';
import { CreateEvaluationCriteriaDto } from './dto/create-evaluation-criteria.dto';
import { UpdateEvaluationCriteriaDto } from './dto/update-evaluation-criteria.dto';
import { EvaluationCriteria } from './entities/evaluation-criteria.entity';
import { IGetUser } from 'src/auth/get-user.interface';
import { EvaluationCriteriaActivityRepository } from './evaluation-criteria-activity.repository';

@Injectable()
export class EvaluationCriteriaRepository extends Repository<EvaluationCriteria> {
  private logger = new Logger(EvaluationCriteriaRepository.name);
  constructor(
    private dataSource: DataSource,
    private evaluationCriteriaActivityRepo: EvaluationCriteriaActivityRepository,
  ) {
    super(EvaluationCriteria, dataSource.createEntityManager());
  }

  async createRecord(
    createEvaluationCriteriaDto: CreateEvaluationCriteriaDto,
    user: IGetUser,
  ): Promise<EvaluationCriteria> {
    try {
      const newData = this.create(createEvaluationCriteriaDto);
      const createdData = await this.save(newData);
      await this.evaluationCriteriaActivityRepo.createRecord(
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
        `${EvaluationCriteriaRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(): Promise<PaginatedResponse> {
    const result = await this.find();

    return {
      records: result,
    };
  }

  async getOne(id: string): Promise<EvaluationCriteria> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(
        `Evaluation Criteria with ID: ${id} not found`,
      );
    }

    return data;
  }

  async updateData(
    id: string,
    updateEvaluationCriteriaDto: UpdateEvaluationCriteriaDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateEvaluationCriteriaDto);
      const updatedData = await this.save(updateData);
      await this.evaluationCriteriaActivityRepo.createRecord(
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
        `${EvaluationCriteriaRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<EvaluationCriteria> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${EvaluationCriteriaRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
