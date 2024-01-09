import { Injectable } from '@nestjs/common';
import { AssignmentOutlineRepository } from './assignment-outline.repository';
import { AssignmentOutline } from './entities/assignment-outline.entity';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateAssignmentOutlineDto } from './dto/create-assignment-outline.dto';
import { UpdateAssignmentOutlineDto } from './dto/update-assignment-outline.dto';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class AssignmentOutlineService {
  constructor(private assignmentOutlineRepo: AssignmentOutlineRepository) {}

  async createAssignmentOutline(
    createAssignmentOutlineDto: CreateAssignmentOutlineDto,
    user: IGetUser,
  ): Promise<AssignmentOutline> {
    return await this.assignmentOutlineRepo.createRecord(
      createAssignmentOutlineDto,
      user,
    );
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    topic: string,
    tech: string,
  ): Promise<PaginatedResponse> {
    return await this.assignmentOutlineRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      topic,
      tech,
    );
  }

  async getOne(id: string): Promise<AssignmentOutline> {
    return await this.assignmentOutlineRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateAssignmentOutlineDto: UpdateAssignmentOutlineDto,
    user: IGetUser,
  ): Promise<AssignmentOutline> {
    return await this.assignmentOutlineRepo.updateData(
      id,
      updateAssignmentOutlineDto,
      user,
    );
  }

  async deleteData(id: string): Promise<AssignmentOutline> {
    return await this.assignmentOutlineRepo.deleteData(id);
  }
}
