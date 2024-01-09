import { Injectable } from '@nestjs/common';
import { TechTrainingRepository } from './tech-training.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { TechTraining } from './entities/tech_training.entity';
import { CreateTechTrainingDto } from './dto/create-tech-training.dto';
import { UpdateTechTrainingDto } from './dto/update-tech-training.dto';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class TechTrainingService {
  constructor(private techTrainingRepo: TechTrainingRepository) {}

  async createTechTraining(
    createTechTrainingDto: CreateTechTrainingDto,
    user: IGetUser,
  ): Promise<TechTraining> {
    return await this.techTrainingRepo.createRecord(
      createTechTrainingDto,
      user,
    );
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    tech: string,
    topic: string,
  ): Promise<PaginatedResponse> {
    return await this.techTrainingRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      tech,
      topic,
    );
  }

  async getOne(id: string): Promise<TechTraining> {
    return await this.techTrainingRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateTechTrainingDto: UpdateTechTrainingDto,
    user: IGetUser,
  ): Promise<TechTraining> {
    return await this.techTrainingRepo.updateData(
      id,
      updateTechTrainingDto,
      user,
    );
  }

  async deleteData(id: string): Promise<TechTraining> {
    return await this.techTrainingRepo.deleteData(id);
  }
}
