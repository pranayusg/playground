import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './entities/question.entity';
import { QuestionRepository } from './question.repository';

@Injectable()
export class QuestionService {
  constructor(private questionRepo: QuestionRepository) {}

  async createQuestion(
    createQuestionDto: CreateQuestionDto,
  ): Promise<Question> {
    return await this.questionRepo.createRecord(createQuestionDto);
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    question: string,
    type: string,
  ): Promise<PaginatedResponse> {
    return await this.questionRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      question,
      type,
    );
  }

  async getOne(id: string): Promise<Question> {
    return await this.questionRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    return await this.questionRepo.updateData(id, updateQuestionDto);
  }

  async deleteData(id: string): Promise<Question> {
    return await this.questionRepo.deleteData(id);
  }
}
