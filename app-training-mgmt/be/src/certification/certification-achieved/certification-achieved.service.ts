import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CertificationAchievedRepository } from './certification-achieved.repository';
import { CertificationAchieved } from './entities/certification-achieved.entity';
import { CreateCertificationAchievedDto } from './dto/create-certification-achieved.dto';
import { UpdateCertificationAchievedDto } from './dto/update-certification-achieved.dto';
import { RawAchievedRepository } from 'src/raw-data/certification/raw-achieved.repository';
import { EmployeeRepository } from 'src/employee/employee.repository';
import { CertificationApprovedRepository } from 'src/certification/certification-approved/certification-approved.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { NA, NO_DATA_MESSAGE } from 'src/core/constant/constatnts';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class CertificationAchievedService {
  private logger = new Logger(CertificationAchievedService.name);
  constructor(
    private certificationAchivedRepository: CertificationAchievedRepository,
    private rawAchievedRepo: RawAchievedRepository,
    private employeeRepo: EmployeeRepository,
    private certificationApprovedRepo: CertificationApprovedRepository,
  ) {}

  async createCertificationAchieved(
    createCertificationAchieved: CreateCertificationAchievedDto,
    user: IGetUser,
  ): Promise<CertificationAchieved> {
    return await this.certificationAchivedRepository.createRecord(
      createCertificationAchieved,
      user,
    );
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
    return await this.certificationAchivedRepository.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      name,
      certification,
      user,
    );
  }

  async getOne(id: string): Promise<CertificationAchieved> {
    return await this.certificationAchivedRepository.getOne(id);
  }

  async updateData(
    id: string,
    updateCertificationAchievedDto: UpdateCertificationAchievedDto,
    user: IGetUser,
  ): Promise<CertificationAchieved> {
    return await this.certificationAchivedRepository.updateData(
      id,
      updateCertificationAchievedDto,
      user,
    );
  }

  async deleteData(id: string): Promise<CertificationAchieved> {
    return await this.certificationAchivedRepository.deleteData(id);
  }

  async transferRawData() {
    try {
      const rawAchievedData = await this.rawAchievedRepo.find({
        where: { isProcessed: false },
      });

      if (rawAchievedData.length === 0) {
        this.logger.log(NO_DATA_MESSAGE);
        return {
          message: NO_DATA_MESSAGE,
        };
      }

      const newData = new CreateCertificationAchievedDto();

      for (const data of rawAchievedData) {
        const employee = await this.employeeRepo.getOneEmployee(data.empId);

        const exam = await this.certificationApprovedRepo.findOne({
          where: {
            certificationName: data.exam,
            level: data.level,
            tech: data.certification,
          },
        });

        if (!exam) {
          throw new NotFoundException(
            `Approved Certification for Tech:${data.certification}, Certification Name:${data.exam}, Level:${data.level}`,
          );
        }

        const existingData =
          await this.certificationAchivedRepository.findExisting(
            data.empId,
            exam.id,
          );

        if (existingData) {
          if (
            existingData.achievedDate !== data.achievedDate ||
            existingData.certificationLink !== data.certificationLink ||
            existingData.expiryDate !== data.expiryDate
          ) {
            await this.certificationAchivedRepository.updateData(
              existingData.id,
              {
                achievedDate: data.achievedDate,
                certificationLink: data.certificationLink,
                expiryDate: data.expiryDate,
              },
              null,
            );
          }
        } else {
          newData.empId = employee;
          newData.exam = exam;
          newData.achievedDate = data.achievedDate;
          newData.expiryDate = data.expiryDate;
          newData.certificationLink =
            data.certificationLink === NA ? null : data.certificationLink;

          await this.certificationAchivedRepository.createRecord(newData, null);
        }
        await this.rawAchievedRepo.updateData(data, {
          isProcessed: true,
        });
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationAchievedService.name}/transferRawData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }

  async getCountOfCertificationAchieved(period: number, requiredDate: Date) {
    return await this.certificationAchivedRepository.getCertifiedCount(
      period,
      requiredDate,
    );
  }

  async getCountOfEmpForCertification(period: number, requiredDate: Date) {
    const certificationTech =
      await this.certificationApprovedRepo.getCertificationTechList();

    const counts = {};

    for (const tech of certificationTech) {
      const value =
        await this.certificationAchivedRepository.countForCertificationTech(
          period,
          requiredDate,
          tech,
        );

      if (value !== 0) {
        counts[tech] = value;
      }
    }
    return counts;
  }
}
