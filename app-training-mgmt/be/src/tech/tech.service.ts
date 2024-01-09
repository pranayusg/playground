import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateTechDto } from './dto/create-tech.dto';
import { UpdateTechDto } from './dto/update-tech.dto';
import { Tech } from './entities/tech.entity';
import { TechRepository } from './tech.repository';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class TechService {
  constructor(private techRepo: TechRepository) {}

  async createTech(
    createTechDto: CreateTechDto,
    user: IGetUser,
  ): Promise<Tech> {
    return await this.techRepo.createRecord(createTechDto, user);
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    name: string,
  ): Promise<PaginatedResponse> {
    return await this.techRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      name,
    );
  }

  async getOne(id: string): Promise<Tech> {
    return await this.techRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateTechDto: UpdateTechDto,
    user: IGetUser,
  ): Promise<Tech> {
    return await this.techRepo.updateData(id, updateTechDto, user);
  }

  async deleteData(id: string): Promise<Tech> {
    return await this.techRepo.deleteData(id);
  }
}
