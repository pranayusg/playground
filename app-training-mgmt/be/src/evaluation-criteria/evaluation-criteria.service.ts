import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateEvaluationCriteriaDto } from './dto/create-evaluation-criteria.dto';
import { UpdateEvaluationCriteriaDto } from './dto/update-evaluation-criteria.dto';
import { EvaluationCriteria } from './entities/evaluation-criteria.entity';
import { EvaluationCriteriaRepository } from './evaluation-criteria.repository';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class EvaluationCriteriaService {
  constructor(private evaluationCriteria: EvaluationCriteriaRepository) {}

  async createEvaluationCriteria(
    createEvaluationCriteriaDto: CreateEvaluationCriteriaDto,
    user: IGetUser,
  ): Promise<EvaluationCriteria> {
    return await this.evaluationCriteria.createRecord(
      createEvaluationCriteriaDto,
      user,
    );
  }

  async getAll(): Promise<PaginatedResponse> {
    return await this.evaluationCriteria.getAll();
  }

  async getOne(id: string): Promise<EvaluationCriteria> {
    return await this.evaluationCriteria.getOne(id);
  }

  async updateData(
    id: string,
    updateEvaluationCriteriaDto: UpdateEvaluationCriteriaDto,
    user: IGetUser,
  ): Promise<EvaluationCriteria> {
    return await this.evaluationCriteria.updateData(
      id,
      updateEvaluationCriteriaDto,
      user,
    );
  }

  async deleteData(id: string): Promise<EvaluationCriteria> {
    return await this.evaluationCriteria.deleteData(id);
  }
}
