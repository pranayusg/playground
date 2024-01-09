import { Injectable } from '@nestjs/common';
import { FeedbackAssignmentRepository } from './feedback-assignment.repository';
import { PaginatedResponse } from 'src/core/interface/pagination.interface';
import { CreateFeedbackAssignmentDto } from './dto/create-feedback-assignment.dto';
import { UpdateFeedbackAssignmentDto } from './dto/update-feedback-assignment.dto';
import { FeedbackAssignment } from './entities/feedback-assignment.entity';
import { IGetUser } from 'src/auth/get-user.interface';

@Injectable()
export class FeedbackAssignmentService {
  constructor(private feedbackAssignmentRepo: FeedbackAssignmentRepository) {}

  async createFeedbackAssignment(
    createFeedbackAssignmentDto: CreateFeedbackAssignmentDto,
    user: IGetUser,
  ): Promise<FeedbackAssignment> {
    return await this.feedbackAssignmentRepo.createRecord(
      createFeedbackAssignmentDto,
      user,
    );
  }

  async getAll(
    pageNo: number,
    noOfRecords: number,
    orderBy: string,
    order: string,
    employee: string,
    status: string,
    user: IGetUser,
  ): Promise<PaginatedResponse> {
    return await this.feedbackAssignmentRepo.getAll(
      pageNo,
      noOfRecords,
      orderBy,
      order,
      employee,
      status,
      user,
    );
  }

  async getOne(id: string): Promise<FeedbackAssignment> {
    return await this.feedbackAssignmentRepo.getOne(id);
  }

  async updateData(
    id: string,
    updateFeedbackAssignmentDto: UpdateFeedbackAssignmentDto,
    user: IGetUser,
  ): Promise<FeedbackAssignment> {
    return await this.feedbackAssignmentRepo.updateData(
      id,
      updateFeedbackAssignmentDto,
      user,
    );
  }

  async deleteData(id: string): Promise<FeedbackAssignment> {
    return await this.feedbackAssignmentRepo.deleteData(id);
  }
}
