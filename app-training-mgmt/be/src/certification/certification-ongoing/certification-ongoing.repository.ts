import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { CertificationOngoing } from './entities/certification-ongoing.entity';
import { CreateCertificationOngoingDto } from './dto/create-certification-ongoing.dto';
import { UpdateCertificationOngoingDto } from './dto/update-certification-ongoing.dto';
import { CertificationOngoingActivityRepository } from './certification-ongoing-activity.repository';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class CertificationOngoingRepository extends Repository<CertificationOngoing> {
  constructor(
    private dataSource: DataSource,
    private certificationOngoingActivityRepo: CertificationOngoingActivityRepository,
  ) {
    super(CertificationOngoing, dataSource.createEntityManager());
  }

  async createRecord(
    createCertificationOngoingDto: CreateCertificationOngoingDto,
    user: IGetUser,
  ): Promise<CertificationOngoing> {
    const newData = this.create(createCertificationOngoingDto);
    const createdData = await this.save(newData);
    await this.certificationOngoingActivityRepo.createRecord(
      user?.username?.id,
      createdData.id,
      null,
      newData,
    );
    return createdData;
  }

  async getAll(): Promise<CertificationOngoing[]> {
    const data = await this.find();
    return data;
  }

  async getOne(id: string): Promise<CertificationOngoing> {
    const data = await this.findOne({ where: { id: id } });

    if (!data) {
      throw new NotFoundException(`Data with ID: ${id} not found`);
    }

    return data;
  }

  async updateData(
    id: string,
    updateCertificationOngoingDto: UpdateCertificationOngoingDto,
    user: IGetUser,
  ) {
    const data = await this.getOne(id);
    try {
      const originalData = { ...data };
      const updateData = Object.assign(data, updateCertificationOngoingDto);
      const updatedData = await this.save(updateData);
      await this.certificationOngoingActivityRepo.createRecord(
        user?.username?.id,
        id,
        originalData,
        updateData,
      );
      return updatedData;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteData(id: string): Promise<CertificationOngoing> {
    const data = await this.getOne(id);

    await this.delete(data);
    return data;
  }
}
