import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { CreateOptionDto } from './dto/create-option.dto';
import { UpdateOptionDto } from './dto/update-option.dto';
import { QuestionOption } from './entities/question-option.entity';

@Injectable()
export class QuestionOptionRepository extends Repository<QuestionOption> {
  private logger = new Logger(QuestionOptionRepository.name);
  constructor(private dataSource: DataSource) {
    super(QuestionOption, dataSource.createEntityManager());
  }

  async createRecord(
    createOptionDto: CreateOptionDto,
  ): Promise<QuestionOption> {
    try {
      const newData = this.create(createOptionDto);
      const createdData = await this.save(newData);
      return createdData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuestionOptionRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    option: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'createdAt';
      let queryBuilder = this.createQueryBuilder('entity').leftJoinAndSelect(
        'entity.questionId',
        'question',
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

      if (option) {
        queryBuilder = queryBuilder.where('entity.optionText ILIKE :option', {
          option: `%${option}%`,
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
        `${QuestionOptionRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<QuestionOption> {
    const data = await this.findOne({
      where: { id: id },
      relations: { questionId: true },
    });

    if (!data) {
      throw new NotFoundException(`Tech Training with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(id: string, updateOptionDto: UpdateOptionDto) {
    const data = await this.getOne(id);
    try {
      const updateData = Object.assign(data, updateOptionDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuestionOptionRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<QuestionOption> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${QuestionOptionRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
