import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CertificationAchieved } from './entities/certification-achieved.entity';
import { CreateCertificationAchievedDto } from './dto/create-certification-achieved.dto';
import { UpdateCertificationAchievedDto } from './dto/update-certification-achieved.dto';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { OrderValue } from 'src/core/enum/order.enum';
import { IGetUser } from 'src/auth/get-user.interface';
import { Role } from 'src/core/enum/role.enum';
import { CertificationAchievedActivityRepository } from './certification-achieved-activity.repository';

@Injectable()
export class CertificationAchievedRepository extends Repository<CertificationAchieved> {
  private logger = new Logger(CertificationAchievedRepository.name);
  constructor(
    private dataSource: DataSource,
    private certificationAchievedActivityRepo: CertificationAchievedActivityRepository,
  ) {
    super(CertificationAchieved, dataSource.createEntityManager());
  }

  async createRecord(
    createCertificationAchieved: CreateCertificationAchievedDto,
    user: IGetUser,
  ): Promise<CertificationAchieved> {
    try {
      const newData = this.create(createCertificationAchieved);
      const createdData = await this.save(newData);
      await this.certificationAchievedActivityRepo.createRecord(
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
        `${CertificationAchievedRepository.name}/createRecord`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
    certification: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    try {
      const take = noOfRecords || 10;
      const page = pageNo || 1;
      const skip = (page - 1) * take;
      const orderByValue = orderBy || 'achievedDate';

      let queryBuilder = this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.empId', 'emp')
        .leftJoinAndSelect('entity.exam', 'examid');

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

      if (user.role === Role.TRAINEE) {
        queryBuilder = queryBuilder.andWhere('emp.id ILIKE :id', {
          id: user.username.id,
        });
      }

      if (name) {
        queryBuilder = queryBuilder.andWhere('emp.name ILIKE :name', {
          name: `%${name}%`,
        });
      }

      if (certification) {
        queryBuilder = queryBuilder.andWhere(
          'examid.certificationName ILIKE :certification',
          {
            certification: `%${certification}%`,
          },
        );
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
        `${CertificationAchievedRepository.name}/getAll`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getOne(id: string): Promise<CertificationAchieved> {
    const data = await this.findOne({
      where: { id: id },
      relations: { exam: true, empId: true },
    });

    if (!data) {
      throw new NotFoundException(`Data with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(
    id: string,
    updateCertificationAchievedDto: UpdateCertificationAchievedDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateCertificationAchievedDto);
      const updatedData = await this.save(updateData);
      await this.certificationAchievedActivityRepo.createRecord(
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
        `${CertificationAchievedRepository.name}/updateData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async deleteData(id: string): Promise<CertificationAchieved> {
    const data = await this.getOne(id);
    try {
      await this.delete(data);
      return data;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationAchievedRepository.name}/deleteData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async findExisting(
    empId: string,
    examId: string,
  ): Promise<CertificationAchieved> {
    try {
      const query = await this.createQueryBuilder('entity')
        .leftJoinAndSelect('entity.empId', 'emp')
        .leftJoinAndSelect('entity.exam', 'examid')
        .where('emp.id = :empId', { empId: empId })
        .andWhere('examid.id = :id', { id: examId })
        .getOne();
      return query;
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationAchievedRepository.name}/findExisting`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCertifiedCount(period: number, requiredDate: Date) {
    try {
      if (period !== 0) {
        const [result, count] = await this.createQueryBuilder('entity')
          .leftJoinAndSelect('entity.empId', 'emp')
          .where('entity.achievedDate >= :requiredDate', { requiredDate })
          .orderBy('emp.name', OrderValue.ASC)
          .take(10)
          .getManyAndCount();

        let formattedResult: any[];

        if (count <= 10) {
          formattedResult = result;
        } else {
          formattedResult = result.slice(0, 10);
          formattedResult.push('...'); // Add ellipsis for more than 10 records
        }

        return { count, result: formattedResult };
      } else {
        const [result, count] = await this.createQueryBuilder('entity')
          .leftJoinAndSelect('entity.empId', 'emp')
          .orderBy('emp.name', OrderValue.ASC)
          .take(10)
          .getManyAndCount();

        let formattedResult: any[];

        if (count <= 10) {
          formattedResult = result;
        } else {
          formattedResult = result.slice(0, 10);
          formattedResult.push('...'); // Add ellipsis for more than 10 records
        }

        return { count, result: formattedResult };
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationAchievedRepository.name}/getCertifiedCount`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async countForCertificationTech(
    period: number,
    requiredDate: Date,
    tech: string,
  ) {
    try {
      const query = this.createQueryBuilder('entity').leftJoinAndSelect(
        'entity.exam',
        'exam',
      );

      if (period !== 0) {
        const res = query
          .where('exam.tech = :certification', { certification: tech })
          .andWhere('entity.achievedDate >= :requiredDate', {
            requiredDate: requiredDate,
          })
          .getCount();

        return res;
      } else {
        const res = query
          .where('exam.tech = :certification', { certification: tech })
          .getCount();

        return res;
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationAchievedRepository.name}/countForCertificationTech`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
