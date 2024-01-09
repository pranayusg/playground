import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CertificationApproved } from './entities/certification-approved.entity';
import { CreateCertificationApprovedDto } from './dto/create-approved-certification.dto';
import { UpdateCertificationApprovedDto } from './dto/update-approved-certification.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { IGetUser } from 'src/auth/get-user.interface';
import { CertificationApprovedActivityRepository } from './certification-approved-activity.repository';

@Injectable()
export class CertificationApprovedRepository extends Repository<CertificationApproved> {
  private logger = new Logger(CertificationApprovedRepository.name);
  constructor(
    private dataSource: DataSource,
    private certificationApprovedActivityRepo: CertificationApprovedActivityRepository,
  ) {
    super(CertificationApproved, dataSource.createEntityManager());
  }

  async createRecord(
    createCertificationApprovedDto: CreateCertificationApprovedDto,
    user: IGetUser,
  ): Promise<CertificationApproved> {
    try {
      const newData = this.create(createCertificationApprovedDto);
      const createdData = await this.save(newData);
      await this.certificationApprovedActivityRepo.createRecord(
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
        `${CertificationApprovedRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    certificationName: string,
    level: string,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'tech';
      let queryBuilder = this.createQueryBuilder('entity');

      if (pageNo == 0) {
        queryBuilder.orderBy(
          `entity.${orderByValue}`,
          order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
        );
      } else {
        queryBuilder
          .orderBy(
            `entity.${orderByValue}`,
            order === 'desc' ? OrderValue.DESC : OrderValue.ASC,
          )
          .take(take)
          .skip(skip);
      }

      if (certificationName) {
        queryBuilder = queryBuilder.where(
          'entity.certificationName ILIKE :name',
          {
            name: `%${certificationName}%`,
          },
        );
      }

      if (level) {
        queryBuilder = queryBuilder.andWhere('entity.level ILIKE :level', {
          level: `%${level}%`,
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
        `${CertificationApprovedRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<CertificationApproved> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Certification with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(
    id: string,
    updateCertificationApprovedDto: UpdateCertificationApprovedDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateCertificationApprovedDto);
      const updatedData = await this.save(updateData);
      await this.certificationApprovedActivityRepo.createRecord(
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
        `${CertificationApprovedRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<CertificationApproved> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationApprovedRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCertificationTechList() {
    try {
      const queryBuilder = await this.createQueryBuilder('entity')
        .select('entity.tech', 'tech')
        .groupBy('entity.tech')
        .orderBy('entity.tech', OrderValue.ASC)
        .getRawMany();
      const certificationsList = queryBuilder.map((result) => result.tech);

      return certificationsList;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationApprovedRepository.name}/getCertificationTechList`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
