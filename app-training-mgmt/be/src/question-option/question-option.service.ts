import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { QuestionOptionRepository } from './question-option.repository';
import { QuestionOption } from './entities/question-option.entity';

@Injectable()
export class QuestionOptionService {
  constructor(private questionOptionRepo: QuestionOptionRepository) {}

  async createOption(
    createOptionDto: CreateOptionDto,
  ): Promise<QuestionOption> {
    return await this.questionOptionRepo.createRecord(createOptionDto);
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    Option: string,
  ): Promise<PaginatedResponse> {
    return await this.questionOptionRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      Option,
    );
  }

  async getOne(id: string): Promise<QuestionOption> {
    return await this.questionOptionRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateOptionDto: UpdateOptionDto,
  ): Promise<QuestionOption> {
    return await this.questionOptionRepo.updateData(id, updateOptionDto);
  }

  async deleteData(id: string): Promise<QuestionOption> {
    return await this.questionOptionRepo.deleteData(id);
  }
}
