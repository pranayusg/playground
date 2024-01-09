import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderValue } from 'src/core/enum/order.enum';
import { Repository, DataSource } from 'typeorm';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ReportRepository extends Repository<Report> {
  private logger = new Logger(ReportRepository.name);
  constructor(
    private dataSource: DataSource,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super(Report, dataSource.createEntityManager());
  }

  async createRecord(createReportDto: CreateReportDto): Promise<Report> {
    try {
      const newData = this.create(createReportDto);
      const createdData = await this.save(newData);
      return createdData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${ReportRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(period: number): Promise<Report> {
    try {
      const orderByValue = 'period';
      const queryBuilder = this.createQueryBuilder('entity')
        .orderBy(`entity.${orderByValue}`, OrderValue.ASC)
        .andWhere('entity.period = :period', {
          period: period,
        });

      const result = await queryBuilder.getOne();
      return result;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${ReportRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<Report> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Tech Training with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(id: string, updateReportDto: UpdateReportDto) {
    const data = await this.getOne(id);
    try {
      const updateData = Object.assign(data, updateReportDto);
      const updatedData = await this.save(updateData);
      return updatedData;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${ReportRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<Report> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${ReportRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
