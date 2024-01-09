import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CertificationApproved } from './entities/certification-approved.entity';
import { CertificationApprovedRepository } from './certification-approved.repository';
import { UpdateCertificationApprovedDto } from './dto/update-approved-certification.dto';
import { CreateCertificationApprovedDto } from './dto/create-approved-certification.dto';
import { RawApprovedCertificationRepository } from 'src/raw-data/certification/raw-approved-certification.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { NO_DATA_MESSAGE } from 'src/core/constant/constatnts';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class CertificationApprovedService {
  private logger = new Logger(CertificationApprovedService.name);
  constructor(
    private certificationApprovedRepo: CertificationApprovedRepository,
    private rawApprovedCertificationRepo: RawApprovedCertificationRepository,
  ) {}

  async createCertificationApproved(
    createCertificationApprovedDto: CreateCertificationApprovedDto,
    user: IGetUser,
  ): Promise<CertificationApproved> {
    return await this.certificationApprovedRepo.createRecord(
      createCertificationApprovedDto,
      user,
    );
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    certificationName: string,
    level: string,
  ): Promise<PaginatedResponse> {
    return await this.certificationApprovedRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      certificationName,
      level,
    );
  }

  async getOne(id: string): Promise<CertificationApproved> {
    return await this.certificationApprovedRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateCertificationApprovedDto: UpdateCertificationApprovedDto,
    user: IGetUser,
  ): Promise<CertificationApproved> {
    return await this.certificationApprovedRepo.updateData(
      id,
      updateCertificationApprovedDto,
      user,
    );
  }

  async deleteData(id: string): Promise<CertificationApproved> {
    return await this.certificationApprovedRepo.deleteData(id);
  }

  async transferRawData() {
    try {
      const rawApprovedCertification =
        await this.rawApprovedCertificationRepo.find({
          where: { isProcessed: false },
        });
      if (rawApprovedCertification.length === 0) {
        this.logger.log(NO_DATA_MESSAGE);
        return {
          message: NO_DATA_MESSAGE,
        };
      }
      const newData: CreateCertificationApprovedDto =
        new CreateCertificationApprovedDto();

      for (const data of rawApprovedCertification) {
        const existingRecord = await this.certificationApprovedRepo.findOne({
          where: {
            tech: data.tech,
            certificationName: data.certificationName,
            level: data.level,
          },
        });
        if (existingRecord) {
          // Compare other columns and update if any are different
          if (existingRecord.costInDollars != data.costInDollars) {
            await this.certificationApprovedRepo.updateData(
              existingRecord.id,
              {
                costInDollars: data.costInDollars,
              },
              null,
            );
          }
        } else {
          newData.tech = data.tech;
          newData.level = data.level;
          newData.certificationName = data.certificationName;
          newData.costInDollars = data.costInDollars;

          await this.certificationApprovedRepo.createRecord(newData, null);
        }
        await this.rawApprovedCertificationRepo.updateData(data, {
          isProcessed: true,
        });
      }
    } catch (error) {
      this.logger.error(
        error.message,
        error.stack,
        `${CertificationApprovedService.name}/transferRawData`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
