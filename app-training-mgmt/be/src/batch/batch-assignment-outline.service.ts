import { Injectable } from '@nestjs/common';
import { BatchAssignmentOutlineRepository } from './batch-assignment-outline.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateBatchAssignmentOutlineDto } from './dto/create-batch-assignment-outline.dto';
import { UpdateBatchAssignmentOutlineDto } from './dto/update-batch-assignment-outline.dto';
import { BatchAssignmentOutline } from './entities/batch-assignment-outline.entity';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class BatchAssignmentOutlineService {
  constructor(
    private batchAssignmentOutlineRepo: BatchAssignmentOutlineRepository,
  ) {}

  async createBatchAssignmentOutline(
    createBatchAssignmentOutlineDto: CreateBatchAssignmentOutlineDto,
    user: IGetUser,
  ): Promise<BatchAssignmentOutline> {
    return await this.batchAssignmentOutlineRepo.createRecord(
      createBatchAssignmentOutlineDto,
      user,
    );
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    return await this.batchAssignmentOutlineRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      user,
    );
  }

  async getOne(id: string): Promise<BatchAssignmentOutline> {
    return await this.batchAssignmentOutlineRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateBatchAssignmentOutlineDto: UpdateBatchAssignmentOutlineDto,
    user: IGetUser,
  ): Promise<BatchAssignmentOutline> {
    return await this.batchAssignmentOutlineRepo.updateData(
      id,
      updateBatchAssignmentOutlineDto,
      user,
    );
  }

  async deleteData(id: string): Promise<BatchAssignmentOutline> {
    return await this.batchAssignmentOutlineRepo.deleteData(id);
  }
}
