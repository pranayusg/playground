import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';

@Injectable()
export class QuestionRepository extends Repository<Question> {
  private logger = new Logger(QuestionRepository.name);
  constructor(private dataSource: DataSource) {
    super(Question, dataSource.createEntityManager());
  }

  async createRecord(createQuestionDto: CreateQuestionDto): Promise<Question> {
    try {
      const newData = this.create(createQuestionDto);
      const createdData = await this.save(newData);
      return createdData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuestionRepository.name}/createReord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    question: string,
    type: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity').leftJoinAndSelect(
        'entity.option',
        'option',
      );

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

      if (question) {
        queryBuilder = queryBuilder.where(
          'entity.questionText ILIKE :question',
          {
            question: `%${question}%`,
          },
        );
      }

      if (type) {
        queryBuilder = queryBuilder.andWhere('entity.questionType = :type', {
          type: type,
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
        `${QuestionRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<Question> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Tech Training with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(id: string, updateQuestionDto: UpdateQuestionDto) {
    const data = await this.getOne(id);
    try {
      const updateData = Object.assign(data, updateQuestionDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuestionRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<Question> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuestionRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
